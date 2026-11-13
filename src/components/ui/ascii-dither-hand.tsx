"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface AsciiDitherHandProps {
  imageSrc: string;
  className?: string;
  side: "left" | "right";
  cellSize?: number;
  contrast?: number;
  brightness?: number;
  density?: number;
  animated?: boolean;
  animStyle?: "shimmer" | "pulse" | "wave";
  animSpeed?: number;
  animIntensity?: number;
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

export function AsciiDitherHand({
  imageSrc,
  className = "",
  side,
  cellSize = 9,
  contrast = 128,
  brightness = 0,
  density = 0,
  animated = true,
  animStyle = "shimmer",
  animSpeed = 100,
  animIntensity = 60,
}: AsciiDitherHandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
  }, [imageSrc]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imageRef.current;
    if (!canvas || !container || !img) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Offscreen sampling of the hand crop
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) {
      ctx.restore();
      return;
    }

    // Draw hand into offscreen canvas with containment
    offCtx.drawImage(img, 0, 0, width, height);

    let imgData: ImageData;
    try {
      imgData = offCtx.getImageData(0, 0, width, height);
    } catch {
      ctx.restore();
      return;
    }
    const pixels = imgData.data;

    // Clear main canvas with transparent background so screen blend floats on mercury
    ctx.clearRect(0, 0, width, height);

    const cSize = Math.max(5, cellSize);
    const cols = Math.ceil(width / cSize);
    const rows = Math.ceil(height / cSize);
    const time = timeRef.current;

    const speedFactor = (animSpeed / 100) * 0.003;
    const intensityFactor = (animIntensity / 100) * 0.4;
    const contrastFactor = contrast / 100;

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

        // Grayscale 100% conversion (perceptual luminance)
        let lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

        // Contrast 128 adjustment
        lum = (lum - 0.5) * contrastFactor + 0.5 + brightness / 255;
        lum = Math.max(0, Math.min(1, lum));

        // Shimmer animation
        if (animated) {
          if (animStyle === "shimmer") {
            // Pseudo-random shimmering wave across cells
            const shimmer =
              Math.sin(time * speedFactor * 2.8 + (c * 23.3 + r * 41.7)) *
              intensityFactor *
              0.55;
            lum = Math.max(0, Math.min(1, lum + shimmer));
          } else if (animStyle === "pulse") {
            const dist = side === "left" ? width - cx : cx;
            const pulse = Math.sin(time * speedFactor - dist * 0.03) * intensityFactor;
            lum = Math.max(0, Math.min(1, lum + pulse));
          }
        }

        // Drop dark background
        if (lum < 0.18) continue;

        // 8x8 Bayer dithering check
        const bayerThreshold = BAYER_8X8[(r % 8) * 8 + (c % 8)] / 64;
        if (lum > bayerThreshold * 0.6) {
          // Micro-dot radius
          const radius = Math.max(
            0.9,
            (cSize / 2) * Math.min(1.1, (lum - bayerThreshold * 0.25) * 1.5) * (1 + density / 100)
          );

          // Monochrome silver-white dither dots (matching 21st.dev recipe & user visual)
          let dotColor: string;
          if (lum > 0.72) {
            dotColor = `rgba(255, 255, 255, ${Math.min(1, 0.92 + lum * 0.08)})`;
          } else if (lum > 0.45) {
            dotColor = `rgba(235, 230, 235, ${0.75 + lum * 0.25})`;
          } else {
            dotColor = `rgba(180, 165, 185, ${0.45 + lum * 0.4})`;
          }

          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Subtle edge fade so the hand melts smoothly into the scene
    const edgeGrad = ctx.createLinearGradient(
      side === "left" ? width * 0.75 : 0,
      0,
      side === "left" ? width : width * 0.25,
      0
    );
    edgeGrad.addColorStop(side === "left" ? 0 : 1, "rgba(55, 2, 50, 0)");
    edgeGrad.addColorStop(side === "left" ? 1 : 0, "rgba(55, 2, 50, 0.4)");
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }, [cellSize, contrast, brightness, density, animated, animStyle, animSpeed, animIntensity, side]);

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      if (animated) {
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
  }, [animated, renderFrame]);

  useEffect(() => {
    const handleResize = () => renderFrame();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        mixBlendMode: "screen",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain transition-opacity duration-700"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
}

export default AsciiDitherHand;

