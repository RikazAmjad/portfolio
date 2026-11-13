"use client";

import React, { useEffect, useRef } from "react";

export function LiquidMercuryCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: true }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      // Fallback: simple dark canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#1d0119";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Liquid mercury / fluid chrome reflection shader
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      // Domain-warped smooth fluid function
      float fluid(vec2 p, float t) {
        vec2 q = p * rot(0.25);
        
        // Base flowing swells
        float w1 = sin(q.x * 1.8 + t * 0.4) * cos(q.y * 1.9 - t * 0.35);
        
        // Warped coordinates
        vec2 warp = q + vec2(
          sin(q.y * 2.5 + t * 0.5 + w1 * 1.2),
          cos(q.x * 2.3 - t * 0.45 + w1 * 1.2)
        ) * 0.4;
        
        float w2 = sin(warp.x * 2.8 - t * 0.4) * cos(warp.y * 2.6 + t * 0.35);
        float w3 = sin((warp.x + warp.y) * 3.2 + t * 0.55);
        
        return (w1 * 0.5 + w2 * 0.35 + w3 * 0.15);
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * 0.75;
        
        // Compute surface normal from gradient
        float eps = 0.006;
        float h = fluid(p * 2.0, t);
        float hx = fluid((p + vec2(eps, 0.0)) * 2.0, t);
        float hy = fluid((p + vec2(0.0, eps)) * 2.0, t);
        
        vec3 normal = normalize(vec3((hx - h) / eps, (hy - h) / eps, 1.85));
        
        // Dynamic chrome/mercury lighting
        vec3 light1 = normalize(vec3(0.35, 0.65, 0.75));
        vec3 light2 = normalize(vec3(-0.45, -0.35, 0.55));
        vec3 view = vec3(0.0, 0.0, 1.0);
        
        vec3 ref1 = reflect(-light1, normal);
        vec3 ref2 = reflect(-light2, normal);
        
        float spec1 = pow(max(dot(ref1, view), 0.0), 28.0);
        float spec2 = pow(max(dot(ref2, view), 0.0), 14.0);
        float fresnel = pow(1.0 - max(dot(normal, view), 0.0), 3.2);
        
        // Deep liquid obsidian plum base (#1a0118 to #32022d)
        vec3 baseColor = mix(
          vec3(0.09, 0.008, 0.08),
          vec3(0.18, 0.015, 0.16),
          h * 0.5 + 0.5
        );
        
        // Liquid chrome / mercury highlight tones
        vec3 mercuryChrome = vec3(0.88, 0.90, 0.95);
        vec3 goldAccent = vec3(1.0, 0.82, 0.25);
        
        vec3 color = baseColor;
        color += spec1 * mercuryChrome * 0.82;
        color += spec2 * vec3(0.45, 0.48, 0.55) * 0.38;
        color += fresnel * mix(mercuryChrome, goldAccent, 0.2) * 0.55;
        
        // Edge vignette
        float d = length(p);
        float vignette = 1.0 - smoothstep(0.5, 1.6, d);
        color *= vignette;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    let animId: number;
    let startTime = performance.now();

    function resize() {
      if (!canvas) return;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl?.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    function render(currentTime: number) {
      if (!gl || !canvas) return;
      resize();

      const elapsed = (currentTime - startTime) * 0.001;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: "block" }}
    />
  );
}

export default LiquidMercuryCanvas;
