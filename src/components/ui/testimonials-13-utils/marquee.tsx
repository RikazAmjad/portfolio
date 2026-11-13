"use client";

import React, { type ComponentPropsWithoutRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: number | string;
  gap?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = 70,
  gap = "12px",
  style,
  ...props
}: MarqueeProps) {
  const durationSec =
    typeof duration === "number"
      ? duration
      : parseFloat(duration) || 70;

  const copiesPerHalf = Math.max(1, Math.floor(repeat / 2));

  return (
    <MotionConfig reducedMotion="never">
      <div
        {...props}
        className={cn("relative flex w-full overflow-hidden select-none", className)}
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          overflow: "hidden",
          width: "100%",
          ...style,
        }}
      >
        <motion.div
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            width: vertical ? "auto" : "max-content",
            height: vertical ? "max-content" : "auto",
            willChange: "transform",
          }}
          animate={
            vertical
              ? { y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
              : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
          }
          transition={{
            ease: "linear",
            duration: durationSec,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* First Half */}
          <div
            style={{
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              gap: gap,
              paddingRight: vertical ? 0 : gap,
              paddingBottom: vertical ? gap : 0,
              flexShrink: 0,
            }}
          >
            {Array(copiesPerHalf)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`part1-${i}`}
                  style={{
                    display: "flex",
                    flexDirection: vertical ? "column" : "row",
                    gap: gap,
                    flexShrink: 0,
                  }}
                >
                  {children}
                </div>
              ))}
          </div>

          {/* Second Half (Identical Clone for Seamless Infinite Loop) */}
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              gap: gap,
              paddingRight: vertical ? 0 : gap,
              paddingBottom: vertical ? gap : 0,
              flexShrink: 0,
            }}
          >
            {Array(copiesPerHalf)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`part2-${i}`}
                  style={{
                    display: "flex",
                    flexDirection: vertical ? "column" : "row",
                    gap: gap,
                    flexShrink: 0,
                  }}
                >
                  {children}
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default Marquee;
