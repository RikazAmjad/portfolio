"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isMagnetic, setIsMagnetic] = useState(false);
  const magneticElementRef = useRef<HTMLElement | null>(null);

  // Exact mouse positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Magnetic center targets
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);

  // Smooth spring configuration for the outer trailing ring
  const springX = useSpring(targetX, { stiffness: 350, damping: 25, mass: 0.35 });
  const springY = useSpring(targetY, { stiffness: 350, damping: 25, mass: 0.35 });

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktop/mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (magneticElementRef.current) {
        const rect = magneticElementRef.current.getBoundingClientRect();
        targetX.set(rect.left + rect.width / 2);
        targetY.set(rect.top + rect.height / 2);
      } else {
        targetX.set(e.clientX);
        targetY.set(e.clientY);
      }

      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Magnetic snapping detection
      const magneticEl = target.closest("[data-magnetic]") as HTMLElement | null;
      magneticElementRef.current = magneticEl;
      setIsMagnetic(!!magneticEl);

      // Contextual cursor text detection
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;
      const text = textEl ? textEl.getAttribute("data-cursor-text") || "" : "";
      setCursorText(text);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      magneticElementRef.current = null;
      setIsMagnetic(false);
      setCursorText("");
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, targetX, targetY]);

  if (!isVisible) return null;

  return (
    <>
      {/* SVG Gooey Matrix Filter */}
      <svg className="pointer-events-none fixed w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="cursor-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
          </filter>
        </defs>
      </svg>

      {/* Core Precision Dot (Focal Point) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-[#FFD000] shadow-[0_0_12px_#FFD000]"
        style={{
          x: mouseX,
          y: mouseY,
          width: 6,
          height: 6,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Trailing Inertial Orbit Ring & Telemetry Pill (Technical Accent) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center rounded-full border border-[#FFD000]/60 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorText ? 130 : isMagnetic ? 52 : 36,
          height: cursorText ? 36 : isMagnetic ? 52 : 36,
          borderRadius: cursorText ? 18 : 26,
          backgroundColor: cursorText ? "rgba(255, 208, 0, 0.18)" : isMagnetic ? "rgba(255, 208, 0, 0.15)" : "rgba(255, 208, 0, 0)",
          borderColor: isMagnetic ? "#FFD000" : "rgba(255, 208, 0, 0.5)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {cursorText && (
          <span className="font-mono text-[10px] font-bold tracking-widest text-white uppercase px-2 select-none">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
