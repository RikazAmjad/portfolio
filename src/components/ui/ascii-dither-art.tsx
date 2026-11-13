"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type RenderMode =
  | "dither"
  | "characters"
  | "matrix"
  | "dots"
  | "cross"
  | "diamond"
  | "braille"
  | "hexagons"
  | "hatch";

export interface AsciiDitherArtProps {
  imageSrc?: string;
  className?: string;
  borderless?: boolean;
  initialRenderMode?: RenderMode;
  cellSize?: number;
  contrast?: number;
  brightness?: number;
  density?: number;
  animated?: boolean;
  animStyle?: "pulse" | "wave" | "shimmer" | "ripple" | "flicker";
  animSpeed?: number;
  animIntensity?: number;
  charSet?: string[];
}

// 8x8 Bayer Matrix for ordered dithering
const BAYER_8X8 = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
];

const STANDARD_CHARSET = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];

export function AsciiDitherArt({
  imageSrc = "/creation-of-adam.jpg",
  className = "",
  borderless = true,
  initialRenderMode = "dither",
  cellSize = 8,
  contrast = 158,
  brightness = 0,
  density = 20,
  animated = true,
  animStyle = "pulse",
  animSpeed = 100,
  animIntensity = 60,
  charSet = STANDARD_CHARSET,
}: AsciiDitherArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderMode] = useState<RenderMode>(initialRenderMode);
  const [isPlaying] = useState(animated);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Load the source image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Fallback procedural hands if image fails
      const fallbackCanvas = document.createElement("canvas");
      fallbackCanvas.width = 1024;
      fallbackCanvas.height = 529;
      const fCtx = fallbackCanvas.getContext("2d");
      if (fCtx) {
        fCtx.fillStyle = "#120110";
        fCtx.fillRect(0, 0, 1024, 529);

        // Adam arm & hand (from left)
        fCtx.strokeStyle = "rgba(242, 238, 229, 0.9)";
        fCtx.lineWidth = 18;
        fCtx.lineCap = "round";
        fCtx.beginPath();
        fCtx.moveTo(0, 360);
        fCtx.bezierCurveTo(200, 330, 350, 290, 485, 270);
        fCtx.stroke();

        // God arm & hand (from right)
        fCtx.strokeStyle = "rgba(255, 208, 0, 0.95)";
        fCtx.lineWidth = 20;
        fCtx.beginPath();
        fCtx.moveTo(1024, 210);
        fCtx.bezierCurveTo(820, 240, 650, 260, 525, 270);
        fCtx.stroke();

        const fallbackImg = new Image();
        fallbackImg.src = fallbackCanvas.toDataURL();
        fallbackImg.onload = () => {
          imageRef.current = fallbackImg;
          setIsLoaded(true);
        };
      }
    };
  }, [imageSrc]);

  // Main Render Function
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imageRef.current;
    if (!canvas || !container || !img) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = container.clientWidth || 900;
    // Native aspect ratio 1024 / 529 ~ 1.935
    const height = Math.round(width * 0.516);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Offscreen sampling of source photo
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) {
      ctx.restore();
      return;
    }

    // Cover-fit image into target dimensions
    const imgAspect = img.width / img.height;
    const targetAspect = width / height;
    let sW = img.width;
    let sH = img.height;
    let sX = 0;
    let sY = 0;
    if (imgAspect > targetAspect) {
      sW = img.height * targetAspect;
      sX = (img.width - sW) / 2;
    } else {
      sH = img.width / targetAspect;
      sY = (img.height - sH) / 2;
    }
    offCtx.drawImage(img, sX, sY, sW, sH, 0, 0, width, height);

    let imgData: ImageData;
    try {
      imgData = offCtx.getImageData(0, 0, width, height);
    } catch {
      ctx.restore();
      return;
    }
    const pixels = imgData.data;

    // Clear background with portfolio deep plum `#370232`
    ctx.fillStyle = "#370232";
    ctx.fillRect(0, 0, width, height);

    // Subtle atmospheric ambient plum glow
    const ambientGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.52,
      20,
      width * 0.5,
      height * 0.52,
      width * 0.46
    );
    ambientGlow.addColorStop(0, "rgba(255, 208, 0, 0.07)");
    ambientGlow.addColorStop(0.5, "rgba(74, 14, 68, 0.2)");
    ambientGlow.addColorStop(1, "rgba(55, 2, 50, 0)");
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, width, height);

    const cSize = Math.max(5, cellSize);
    const cols = Math.ceil(width / cSize);
    const rows = Math.ceil(height / cSize);
    const time = timeRef.current;

    // Animation speed and intensity multipliers
    const speedFactor = (animSpeed / 100) * 0.003;
    const intensityFactor = (animIntensity / 100) * 0.38;

    // Contrast adjustment math
    const contrastFactor = contrast / 100;

    ctx.font = `700 ${Math.max(8, cSize)}px var(--font-geist-mono), monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cSize;
        const y = r * cSize;
        const cx = x + cSize / 2;
        const cy = y + cSize / 2;

        const sampleX = Math.min(width - 1, Math.floor(cx));
        const sampleY = Math.min(height - 1, Math.floor(cy));
        const idx = (sampleY * width + sampleX) * 4;

        const red = pixels[idx];
        const green = pixels[idx + 1];
        const blue = pixels[idx + 2];
        const alpha = pixels[idx + 3] / 255;

        if (alpha < 0.05) continue;

        // Relative perceptual luminance
        let lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

        // Contrast & brightness curve
        lum = (lum - 0.5) * contrastFactor + 0.5 + brightness / 255;
        lum = Math.max(0, Math.min(1, lum));

        // Animated modulation (pulse radiating from fingertips)
        if (isPlaying) {
          let mod = 0;
          if (animStyle === "pulse") {
            const distFromFingertips = Math.hypot(cx - width * 0.505, cy - height * 0.52);
            mod = Math.sin(time * speedFactor - distFromFingertips * 0.02) * intensityFactor;
          } else if (animStyle === "wave") {
            mod = Math.sin(time * speedFactor + cx * 0.03 + cy * 0.02) * intensityFactor;
          } else if (animStyle === "shimmer") {
            mod = Math.sin(time * speedFactor * 2.5 + (c * 17 + r * 31)) * intensityFactor * 0.5;
          }
          lum = Math.max(0, Math.min(1, lum + mod));
        }

        // Threshold cutoff for dark background
        if (lum < 0.1) continue;

        // Portfolio color mapping:
        // High highlights -> Electric Gold `#FFD000` & Luminous Cream `#F2EEE5`
        // Midtones -> Soft Plum `#D1B8CE`
        // Contours -> Warm Violet `#744470`
        let fillStyle: string;
        if (lum > 0.68) {
          fillStyle = `rgba(255, 208, 0, ${Math.min(1, 0.88 + lum * 0.12)})`;
        } else if (lum > 0.42) {
          fillStyle = `rgba(242, 238, 229, ${Math.min(1, 0.78 + lum * 0.22)})`;
        } else if (lum > 0.24) {
          fillStyle = `rgba(209, 184, 206, ${0.55 + lum * 0.35})`;
        } else {
          fillStyle = `rgba(116, 68, 112, ${0.4 + lum * 0.4})`;
        }

        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = fillStyle;

        if (renderMode === "dither") {
          // Ordered 8x8 Bayer dithering
          const bayerThreshold = BAYER_8X8[(r % 8) * 8 + (c % 8)] / 64;
          if (lum > bayerThreshold * 0.62) {
            const radius = Math.max(
              0.8,
              (cSize / 2) * Math.min(1.15, (lum - bayerThreshold * 0.28) * 1.55) * (density / 20)
            );
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (renderMode === "characters") {
          const charIndex = Math.min(
            charSet.length - 1,
            Math.floor(lum * charSet.length)
          );
          const char = charSet[charIndex];
          if (char && char !== " ") {
            ctx.fillText(char, cx, cy);
          }
        } else if (renderMode === "dots") {
          const radius = (cSize / 2) * lum * 0.95;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 5. Post-Effects: Glowing Fingertip Spark Aura (The Divine Spark)
    // Centered exactly between Adam's and God's fingertips
    const sparkX = width * 0.505;
    const sparkY = height * 0.522;
    const sparkPhase = Math.sin(time * 0.005);
    const sparkRadius = 16 + sparkPhase * 6;

    const sparkGrad = ctx.createRadialGradient(
      sparkX,
      sparkY,
      0,
      sparkX,
      sparkY,
      sparkRadius * 2.2
    );
    sparkGrad.addColorStop(0, "rgba(255, 208, 0, 0.95)");
    sparkGrad.addColorStop(0.35, "rgba(255, 208, 0, 0.38)");
    sparkGrad.addColorStop(1, "rgba(255, 208, 0, 0)");
    ctx.fillStyle = sparkGrad;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, sparkRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Core White-Hot Spark
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 2.5 + Math.abs(sparkPhase) * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [
    cellSize,
    contrast,
    brightness,
    density,
    renderMode,
    isPlaying,
    animStyle,
    animSpeed,
    animIntensity,
    charSet,
  ]);

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      if (isPlaying) {
        timeRef.current += delta;
      }
      renderFrame();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, renderFrame]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      renderFrame();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  if (borderless) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden flex items-center justify-center select-none ${className}`}
        style={{
          maskImage:
            "radial-gradient(ellipse 92% 86% at 50% 50%, black 55%, transparent 98%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 86% at 50% 50%, black 55%, transparent 98%)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto object-contain transition-opacity duration-700 pointer-events-none"
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl border border-white/10 bg-[#370232]/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col items-center ${className}`}
    >
      <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-white/10 bg-[#2D0129] shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </div>
  );
}

export default AsciiDitherArt;
