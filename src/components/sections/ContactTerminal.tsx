"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Copy, Check, Send } from "lucide-react";
import { sound } from "@/lib/sound";
import { LiquidMercuryCanvas } from "@/components/ui/liquid-mercury-canvas";

export function ContactTerminal() {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const email = "rikazamjad@gmail.com";

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for layering
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["24px", "0px"]);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sound.playTransmit();
    setSent(true);

    // Direct mailto link trigger with idea content
    window.location.href = `mailto:${email}?subject=Project%20Idea&body=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setMessage("");
      setSent(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-[#370232] text-[#F2EEE5] min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden z-30 px-4 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28 md:pt-44 md:pb-36"
    >
      {/* Top Inward Curving Border: Continuous organic concave curve with zero squared edges and zero border lines */}
      <div className="absolute -top-[2px] left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-14 sm:h-20 md:h-28 lg:h-32 block filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
        >
          {/* Cream overlay shape dipping into the dark section with horizontal entry/exit tangents */}
          <path
            d="M -10,-5 L 1450,-5 L 1450,0 C 1200,0 960,80 720,80 C 480,80 240,0 -10,0 Z"
            fill="#F2EEE5"
          />
        </svg>
      </div>
      {/* 1. Liquid Mercury / Molten Chrome Fluid Background in continuous motion */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[116%] -top-[8%] pointer-events-none"
      >
        <LiquidMercuryCanvas />
      </motion.div>

      {/* Atmospheric Vignette & Contrast Depth */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/25 to-black/75 z-10"
        aria-hidden="true"
      />

      {/* 2. Center Content with Unified Hobeaux Typography & Dedicated "Write Me Your Ideas" Input Field */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-20 mx-auto w-full max-w-4xl text-center flex flex-col items-center px-4"
      >
        {/* Availability Status Badge */}
        {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md mb-6 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD000] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD000]"></span>
          </span>
          <span className="font-['Hobeaux',cursive,sans-serif] text-xs font-bold tracking-widest text-[#FFD000] uppercase">
            Available For High-Impact Projects
          </span>
        </div> */}

        {/* Primary Call to Action in Hobeaux Font */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 font-['Hobeaux',cursive,sans-serif] uppercase leading-[0.92] text-[#F2EEE5] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          Got a system to build? <br />
          <span className="text-[#FFD000] drop-shadow-[0_0_24px_rgba(255,208,0,0.45)]">
            Let&apos;s talk.
          </span>
        </h2>

        {/* Subtitle in Consistent Font Style */}
        <p className="max-w-xl font-['Hobeaux',cursive,sans-serif] text-sm sm:text-base md:text-lg text-[#D1B8CE] leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Open to fractional architecture consulting, core systems design, or greenfield platform builds. Direct communication, no recruiter friction.
        </p>

        {/* Dedicated "Write Me Your Ideas" Interactive Input Field */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl flex flex-col items-center gap-4 mt-2"
        >
          <div className="relative w-full flex items-center rounded-full border border-white/20 bg-black/60 backdrop-blur-xl p-1.5 sm:p-2 shadow-[0_16px_45px_rgba(0,0,0,0.8)] transition-all duration-300 focus-within:border-[#FFD000] focus-within:ring-2 focus-within:ring-[#FFD000]/30 hover:border-white/40">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write me your ideas..."
              className="w-full bg-transparent pl-6 pr-4 py-3 sm:py-4 font-['Hobeaux',cursive,sans-serif] text-base sm:text-xl md:text-2xl text-[#F2EEE5] placeholder-white/35 focus:outline-none"
            />

            <button
              type="submit"
              data-magnetic="true"
              className="shrink-0 flex items-center gap-2 font-['Hobeaux',cursive,sans-serif] text-base sm:text-xl text-[#370232] bg-[#FFD000] hover:bg-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 uppercase tracking-tight shadow-lg hover:scale-105 active:scale-95"
            >
              <span>{sent ? "Sent!" : "Send"}</span>
              <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Quick Email Clipboard Copy Pill */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 font-['Hobeaux',cursive,sans-serif] text-xs sm:text-sm text-[#D1B8CE] hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm mt-1"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[#FFD000]" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#FFD000]" />
            )}
            <span>{copied ? "COPIED TO CLIPBOARD" : email}</span>
          </button>
        </form>
      </motion.div>
    </section>
  );
}

export default ContactTerminal;
