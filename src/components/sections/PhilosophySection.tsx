"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { StackingCards } from "@/components/ui/stacking-card";
import CharacterCanvas from "@/components/canvas/CharacterCanvas";

export function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const heroBlockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroBlockRef,
    offset: ["start 80%", "end 45%"],
  });

  const waveProgress = useTransform(scrollYProgress, [0, 0.82], [0, 1], { clamp: true });

  const manifesto =
    "I engineer robust backend architectures and pair them with meticulous, responsive interfaces. Clean code, type safety, and real-world performance engineered with uncompromising craft.";

  const words = manifesto.split(" ");
  let globalCharIndex = 0;
  const totalChars = manifesto.length;

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section
      id="architecture"
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="group relative z-20 w-full bg-[#F2EEE5] text-[#370232] pt-20 pb-6 sm:pt-24 md:pt-24 md:pb-10 rounded-t-[56px] md:rounded-t-[72px] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] mt-[-64px] overflow-visible"
    >
      {/* Interactive Dot Grid with Mouse-Following Radial Mask */}
      <div className="absolute inset-0 rounded-t-[56px] md:rounded-t-[72px] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-25 dot-grid"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dot-grid"
          style={{
            maskImage: "radial-gradient(450px at var(--mouse-x, -500px) var(--mouse-y, -500px), black, transparent)",
            WebkitMaskImage: "radial-gradient(450px at var(--mouse-x, -500px) var(--mouse-y, -500px), black, transparent)",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[94rem] px-6 md:px-12 flex flex-col gap-8 md:gap-10">
        {/* Section Index Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 font-mono text-xs font-semibold tracking-widest text-[#744470] uppercase">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
            <span>ARCHITECTURE // CONTINUOUS THREAD</span>
          </div>
          <span>(01)</span>
        </div>

        {/* Section Headline in Signature Hero Hobeaux 3D Pop Typography */}
        <div className="pt-1">
          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.2vw] font-bold uppercase tracking-tight leading-[0.92] select-none flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2">
            <span className="siglitos-pop-white">Capabilities</span>
            <span className="siglitos-pop-yellow">//</span>
            <span className="siglitos-pop-white">Technical Skill Set</span>
          </h2>
        </div>

        {/* Full-Width Manifesto Details Text + Centered Reclining Character */}
        <div
          ref={heroBlockRef}
          className="flex flex-col w-full relative"
        >
          {/* Top: Full-Width Manifesto Text */}
          <div className="w-[80%]">
            <p
              ref={textRef}
              className="flex flex-wrap font-['Hobeaux',cursive,sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-[2.7vw] font-bold tracking-wide leading-[1.16]"
            >
              {words.map((word, wordIdx) => (
                <span key={wordIdx} className="mr-[0.28em] my-1 inline-flex">
                  {word.split("").map((char, charIdx) => {
                    const currIdx = globalCharIndex++;
                    const charStart = currIdx / totalChars;
                    const charEnd = Math.min((currIdx + 1) / totalChars, 1);
                    return (
                      <CharScrub
                        key={charIdx}
                        char={char}
                        progress={scrollYProgress}
                        range={[charStart, charEnd]}
                      />
                    );
                  })}
                </span>
              ))}
            </p>
          </div>

          {/* Center: Reclining 3D Developer Character Directly Under Text (Balanced Scale) */}
          <div className="flex justify-center items-center w-full -mt-8 relative z-10 pointer-events-auto">
            <div
              className="relative w-full max-w-[480px] sm:max-w-[580px] md:max-w-[680px] lg:max-w-[740px]"
              style={{
                aspectRatio: "1.8 / 1",
                filter: "drop-shadow(0 20px 30px rgba(55, 2, 50, 0.12)) drop-shadow(0 8px 12px rgba(55, 2, 50, 0.08))",
              }}
            >
              <CharacterCanvas progressSource={waveProgress} />
            </div>
          </div>
        </div>

      </div>

      {/* Stacking Skill Cards Component displaying all 4 Core Disciplines */}
      <div className="px-3 sm:px-6 md:px-10 mt-10">
        <StackingCards />
      </div>
    </section>
  );
}

function CharScrub({
  char,
  progress,
  range,
}: {
  char: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const color = useTransform(progress, range, ["#A3849F", "#370232"]);
  return (
    <motion.span style={{ color }} className="inline-block transition-colors duration-75">
      {char}
    </motion.span>
  );
}
