"use client";

import { useRef, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { StackingCards } from "@/components/ui/stacking-card";
import CharacterCanvas from "@/components/canvas/CharacterCanvas";

export function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const heroBlockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Expanded, natural scroll tracking window across the manifesto block
  const { scrollYProgress } = useScroll({
    target: heroBlockRef,
    offset: ["start 82%", "end 32%"],
  });

  // Physical spring smoothing: absorbs mouse-wheel steps and trackpad velocity for buttery scrub
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.2,
    restDelta: 0.0005,
  });

  // Harmonized wave motion for 3D character
  const waveProgress = useTransform(smoothProgress, [0.05, 0.9], [0, 1], { clamp: true });

  const manifesto =
    "I engineer robust backend architectures and pair them with meticulous, responsive interfaces. Clean code, type safety, and real-world performance engineered with uncompromising craft.";

  // Pre-calculate word and character ranges once for zero render churn
  const { wordsData } = useMemo(() => {
    const rawWords = manifesto.split(" ");
    let charCounter = 0;
    const total = manifesto.length;

    const wordsData = rawWords.map((word) => {
      const chars = word.split("").map((char) => {
        const start = charCounter / total;
        // Soft overlapping transition ramp across 4.5% scroll span
        const end = Math.min(start + 0.045, 1);
        charCounter++;
        return { char, start, end };
      });
      // Count whitespace after word
      charCounter++;
      return { word, chars };
    });

    return { wordsData };
  }, [manifesto]);

  // RequestAnimationFrame throttled mouse position tracking for dot-grid spotlight
  const mousePosRef = useRef({ x: -500, y: -500 });
  const rafIdRef = useRef<number | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (rafIdRef.current === null && containerRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.setProperty("--mouse-x", `${mousePosRef.current.x}px`);
          containerRef.current.style.setProperty("--mouse-y", `${mousePosRef.current.y}px`);
        }
        rafIdRef.current = null;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <section
      id="architecture"
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="group relative z-20 w-full bg-[#F2EEE5] text-[#370232] pt-20 pb-6 sm:pt-24 md:pt-24 md:pb-10 rounded-t-[56px] md:rounded-t-[72px] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] mt-[-64px] overflow-visible"
    >
      {/* Interactive Dot Grid with Smooth Mouse-Following Radial Mask */}
      <div className="absolute inset-0 rounded-t-[56px] md:rounded-t-[72px] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-25 dot-grid"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dot-grid will-change-[mask-image]"
          style={{
            maskImage: "radial-gradient(450px at var(--mouse-x, -500px) var(--mouse-y, -500px), black, transparent)",
            WebkitMaskImage: "radial-gradient(450px at var(--mouse-x, -500px) var(--mouse-y, -500px), black, transparent)",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[94rem] px-6 md:px-12 flex flex-col gap-8 md:gap-10">
        {/* Section Index Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between border-b border-black/10 pb-4 font-mono text-xs font-semibold tracking-widest text-[#744470] uppercase"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
            <span>ARCHITECTURE // CONTINUOUS THREAD</span>
          </div>
          <span>(01)</span>
        </motion.div>

        {/* Section Headline in Signature Hero Hobeaux 3D Pop Typography */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1"
        >
          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.2vw] font-bold uppercase tracking-tight leading-[0.92] select-none flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2">
            <span className="siglitos-pop-white">Capabilities</span>
            <span className="siglitos-pop-yellow">//</span>
            <span className="siglitos-pop-white">Technical Skill Set</span>
          </h2>
        </motion.div>

        {/* Full-Width Manifesto Details Text + Centered Reclining Character */}
        <div
          ref={heroBlockRef}
          className="flex flex-col w-full relative"
        >
          {/* Top: Full-Width Manifesto Text with Smooth Color Gradation */}
          <div className="w-[85%] md:w-[80%]">
            <p
              ref={textRef}
              className="flex flex-wrap font-['Hobeaux',cursive,sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-[2.7vw] font-bold tracking-wide leading-[1.16]"
            >
              {wordsData.map(({ chars }, wordIdx) => (
                <span key={wordIdx} className="mr-[0.28em] my-1 inline-flex">
                  {chars.map(({ char, start, end }, charIdx) => (
                    <CharScrub
                      key={charIdx}
                      char={char}
                      progress={smoothProgress}
                      start={start}
                      end={end}
                    />
                  ))}
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

/**
 * Pure Motion-driven character color scrubber without conflicting CSS transitions.
 * Glides smoothly through hexadecimal channels at 60/120fps.
 */
function CharScrub({
  char,
  progress,
  start,
  end,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const color = useTransform(progress, [start, end], ["#A68A9E", "#370232"]);
  return (
    <motion.span style={{ color }} className="inline-block">
      {char}
    </motion.span>
  );
}
