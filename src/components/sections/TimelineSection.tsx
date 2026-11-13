"use client";

import { useRef, useState } from "react";
import Timeline from "@/components/ui/timeline";

export function TimelineSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="story"
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="group relative z-20 w-full bg-[#370232] text-[#F2EEE5] overflow-visible"
    >
      {/* Anchor for backward compatibility with #matrix */}
      <div id="matrix" className="absolute -top-24 pointer-events-none" />

      {/* Subtle Dot Grid Background matching Hero & Dark Chapter */}
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

      {/* Section Header & Lead-In */}
      <div className="relative z-10 mx-auto w-full max-w-[94rem] px-6 md:px-12 pt-24 pb-8 flex flex-col gap-2">
        {/* Section Index Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs font-semibold tracking-widest text-[#D1B8CE] uppercase">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
            <span>ENGINEERING STORYLINE // CHRONOLOGY</span>
          </div>
          <span>(03)</span>
        </div>

        {/* Lead-in Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 pt-4">
          <div>
            <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.92] select-none flex flex-wrap gap-x-4 items-center">
              <span className="siglitos-pop-white">Three Years,</span>
              <span className="siglitos-pop-yellow">One Story</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#D1B8CE] leading-relaxed font-sans">
              From full-stack CRUD applications and modern frontend design systems to scalable enterprise software engineering.
              Scroll through the horizontal track to explore each milestone.
            </p>
          </div>

          {/* <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-xs font-semibold text-[#FFD000] tracking-wider uppercase">
            <span className="animate-pulse w-2 h-2 rounded-full bg-[#FFD000]" />
            <span>SCROLL TO TRACE HORIZONTAL TRACK ↓</span>
          </div> */}
        </div>
      </div>

      {/* Pinned Scroll-Driven Horizontal Timeline */}
      <div className="relative z-10 w-full">
        <Timeline
          title="My Professional Story"
          periodLabel="2024 — 2026"
          backgroundColor="#370232"
          textColor="#F2EEE5"
          mutedTextColor="#D1B8CE"
          activeColor="#FFD000"
          imageUrl="/coding.jpg"
          imageAlt="Rikaz Amjad engineering workspace"
          duration={0.6}
        />
      </div>
    </section>
  );
}

export default TimelineSection;

