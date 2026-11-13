"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import KeycapOrb from "@/components/ui/keycap-orb";
import { ArrowDown } from "lucide-react";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const KEYCAP_PALETTE = {
  ink: { cap: "#240121", legend: "#F2EEE5" },
  ash: { cap: "#744470", legend: "#FFD000" },
  glass: { cap: "#4A0E44", legend: "#FFD000" },
  cobalt: { cap: "#4A0E44", legend: "#FFD000" },
  lime: { cap: "#FFD000", legend: "#370232" },
};

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { isPreloaderFinished } = usePreloader();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const scrollToExplore = () => {
    const nextSection = document.getElementById("architecture");
    if (nextSection) {
      const globalLenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement) => void } }).__lenis;
      if (globalLenis) {
        globalLenis.scrollTo(nextSection);
      } else {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="group sticky top-0 flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#370232] text-[#F2EEE5] z-10 select-none"
    >
      {/* Background Dot Structure across the whole Hero section (matching Capabilities / Technical Skill Set) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dot-grid-dark z-0"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 dot-grid-dark z-0"
        style={{
          maskImage: `radial-gradient(450px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(450px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[94rem] flex-1 flex-col justify-center px-6 pt-16 pb-5 md:px-12 md:pt-20 md:pb-6 pointer-events-none">
        {/* Top Status Metadata Row */}
        {/* <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={isPreloaderFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between font-mono text-[11px] md:text-xs tracking-[0.2em] text-[#D1B8CE] uppercase"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD000]" />
            </span>
            <span>[ 00 ] // OPEN TO COLLABORATIONS</span>
          </div>
          <span className="hidden sm:inline text-white/40">DISTRIBUTED SYSTEMS &amp; CREATIVE CRAFT</span>
        </motion.div> */}

        {/* Middle Stage: Left Column Headline + Right Corner Keycap Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center lg:mb-6">
          {/* Left Column: Engineer Products Worth Untangling */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col font-['Hobeaux',cursive,sans-serif] leading-[0.92] tracking-[-0.01em] text-3xl sm:text-5xl lg:text-[3.2vw] xl:text-[3.6vw]"
          >
            <div className="siglitos-pop-white">Develop</div>
            <div className="siglitos-pop-white">Products</div>
            <div className="siglitos-pop-white">that</div>
            <div className="siglitos-pop-white">Worth</div>
            <div className="siglitos-pop-white">Untangling</div>
          </motion.div>

          {/* Right Corner: Central Keycap Structure (Floating seamlessly over the dot background) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex items-center justify-center lg:justify-end pointer-events-auto"
          >
            <div className="w-full max-w-[500px] h-[260px] sm:h-[320px] md:h-[360px] lg:h-[390px] flex items-center justify-center">
              <KeycapOrb
                height="140%"
                transparent={true}
                background="transparent"
                glow="#FFD000"
                palette={KEYCAP_PALETTE}
                scale={0.92}
                rings={9}
                autoRotate={true}
                speed={0.9}
                reflection={false}
                ripple={true}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Spanning RIKAZ AMJAD Name & Sub-bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Unified Colossal Name in matching Hobeaux 3D Pop Style */}
          <h1 className="font-bold uppercase tracking-wider leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-[7.8vw] xl:text-[8.8vw] font-['Hobeaux',cursive,sans-serif] flex items-baseline whitespace-nowrap select-none">
            <span className="siglitos-pop-white">I'M RIKAZ AMJAD</span>
          </h1>

          {/* Footer Metadata & Explore Navigation */}
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-[#D1B8CE] pt-2 sm:pt-2.5 tracking-[0.2em] uppercase">
            <span>SOFTWARE ENGINEER — 2026</span>
            <button
              onClick={scrollToExplore}
              data-magnetic="true"
              className="group flex items-center gap-2 hover:text-[#FFD000] transition-colors pointer-events-auto cursor-pointer"
            >
              <span>SCROLL TO EXPLORE</span>
              <ArrowDown className="h-3 w-3 text-[#FFD000] transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
