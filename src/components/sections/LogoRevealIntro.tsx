"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal";
import { BRAND_LOGO } from "@/lib/brand-logo";

interface LogoRevealIntroProps {
  /** Called when the glass reveal completes its first cycle and the screen can exit */
  onComplete?: () => void;
}

export function LogoRevealIntro({ onComplete }: LogoRevealIntroProps) {
  const [phase, setPhase] = useState<"reveal" | "exiting" | "done">("reveal");

  // When the glass animation completes its first pass, start the exit fade
  const handleRevealComplete = useCallback(() => {
    if (phase !== "reveal") return;
    setPhase("exiting");
    const t = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 800);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  // Click to skip
  const handleSkip = useCallback(() => {
    if (phase === "done") return;
    setPhase("exiting");
    const t = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 500);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  // Escape to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSkip]);

  if (phase === "done") return null;

  return (
    <div
      aria-label="Portfolio loading screen"
      role="dialog"
      aria-modal="true"
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#370232",
        opacity: phase === "exiting" ? 0 : 1,
        transition: "opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: phase === "exiting" ? "none" : "auto",
        cursor: "pointer",
      }}
    >
      {/* Liquid Glass Logo Reveal using the exact brand logo structure */}
      <GlassIconReveal
        logo={BRAND_LOGO}
        label="Brand Logo"
        look="dark"
        background="#370232"
        plateColor="#4a0345"
        logoColor="#F2EEE5"
        iconPlate={true}
        keepPlate={false}
        tileSize={320}
        logoScale={0.72}
        finalScale={0.95}
        loop={false}
        speed={1.0}
        hold={0.6}
        onRevealComplete={handleRevealComplete}
        tuning={{
          dispersion: 1.4,
          colorBleed: 1.0,
          corner: 5.2,
          specular: 0.9,
          halo: 1.2,
          shadow: 0,
          ripple: 0.6,
          startZoom: 2.0,
          glide: 2.1,
          present: 2.2,
          sheen: 0.8,
          lightTurn: 0.7,
          bevelWidth: 0.18,
          opticalDepth: 0.85,
          drift: 0.06,
        }}
        style={{ width: "min(340px, 80vw)", height: "min(340px, 80vw)" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default LogoRevealIntro;
