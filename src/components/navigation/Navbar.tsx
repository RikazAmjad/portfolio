"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Optical Microscope Loupe for the Brand Name.
 * Magnifies the typography under the cursor (1.5x scale) within an optical bezel.
 */
function MicroscopeBrandName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      data-microscope="true"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="relative hidden sm:flex flex-col select-none py-1 px-1.5 -my-1 -mx-1.5 cursor-crosshair"
    >
      {/* ── Base Normal Layer (1x Cream) ── */}
      <div className="flex flex-col">
        <span className="font-mono text-[11px] font-bold tracking-widest text-[#F2EEE5] uppercase whitespace-nowrap">
          RIKAZ AMJAD
        </span>
        <span className="font-mono text-[9px] tracking-wider text-[#F2EEE5]/70 uppercase whitespace-nowrap">
          software engineer
        </span>
      </div>

      {/* ── Microscope Magnification Lens Overlay ── */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{ zIndex: 100 }}
        >
          {/* Zoomed Lens Content (Clipped to circular aperture) */}
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{
              clipPath: `circle(36px at ${coords.x}px ${coords.y}px)`,
              WebkitClipPath: `circle(36px at ${coords.x}px ${coords.y}px)`,
              transformOrigin: `${coords.x}px ${coords.y}px`,
              transform: "scale(1.52)",
              backgroundColor: "#370232",
              filter: "contrast(1.2) brightness(1.12)",
            }}
          >
            <span
              className="font-mono text-[11px] font-black tracking-widest text-[#F2EEE5] uppercase whitespace-nowrap"
              style={{
                textShadow: "0 0 8px rgba(242, 238, 229, 0.6), 0 0 1px #F2EEE5",
              }}
            >
              RIKAZ AMJAD
            </span>
            <span className="font-mono text-[9px] font-semibold tracking-wider text-[#F2EEE5]/90 uppercase whitespace-nowrap">
              software engineer
            </span>
          </div>

          {/* Microscope Optical Bezel / Ring */}
          <div
            style={{
              position: "absolute",
              left: coords.x,
              top: coords.y,
              width: 72,
              height: 72,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: "1.5px solid #F2EEE5",
              boxShadow:
                "0 0 16px rgba(242, 238, 229, 0.35), inset 0 0 12px rgba(242, 238, 229, 0.15)",
              background:
                "radial-gradient(circle, rgba(242, 238, 229, 0.08) 0%, rgba(55, 2, 50, 0.25) 75%, transparent 100%)",
            }}
          >
            {/* Crosshair Hairline Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-3 h-[1px] bg-[#F2EEE5]" />
              <div className="h-3 w-[1px] bg-[#F2EEE5] absolute" />
            </div>

            {/* Calibration Ticks at cardinal directions */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-[1px] bg-[#F2EEE5]/70" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-[1px] bg-[#F2EEE5]/70" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-[1px] bg-[#F2EEE5]/70" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 h-1.5 w-[1px] bg-[#F2EEE5]/70" />
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Architecture", href: "#architecture", num: "01" },
    { label: "Selected Works", href: "#works", num: "02" },
    { label: "Engineering Story", href: "#story", num: "03" },
    { label: "Field Notes", href: "#notes", num: "04" },
    { label: "Dispatch Terminal", href: "#contact", num: "05" },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 w-full pointer-events-none"
      >
        <nav className="mx-auto flex w-full max-w-[94rem] items-center justify-between px-6 py-6 md:px-12 pointer-events-auto">
          {/* Monogram Brandmark with Microscope Loupe */}
          <a
            href="#"
            aria-label="Rikaz Amjad Home"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img
              src="/logo.png"
              alt="Logo"
              width={34}
              height={34}
              className="h-8.5 w-8.5 object-contain select-none pointer-events-none"
            />
            <MicroscopeBrandName />
          </a>

          {/* Magnetic Hamburger Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-magnetic="true"
            aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-[#F2EEE5]/20 bg-[#F2EEE5]/10 p-3 outline-none backdrop-blur-md transition-colors hover:border-[#F2EEE5]/40"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-5 bg-[#F2EEE5] origin-center"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-5 bg-[#F2EEE5] origin-center"
            />
          </button>
        </nav>
      </motion.header>

      {/* Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#140112] p-8 md:p-16"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,208,0,0.06),transparent_50%)] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <span className="font-mono text-xs font-semibold tracking-widest text-[#FFD000] uppercase">
                // SYSTEM NAVIGATION
              </span>
              <span className="font-mono text-xs tracking-wider text-[#F2EEE5]/40 uppercase">
                STATUS: ONLINE
              </span>
            </div>

            <div className="my-auto flex flex-col gap-4 sm:gap-6">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  data-cursor-text="GOTO"
                  className="group flex items-baseline gap-4 text-3xl font-bold tracking-tight text-[#F2EEE5] transition-colors hover:text-[#FFD000] sm:text-5xl md:text-6xl font-['Hobeaux',cursive,sans-serif]"
                >
                  <span className="font-mono text-xs sm:text-sm font-normal text-[#FFD000]/60 transition-colors group-hover:text-[#FFD000]">
                    ({item.num})
                  </span>
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between font-mono text-xs text-[#F2EEE5]/60">
              <div className="flex gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFD000] transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFD000] transition-colors"
                >
                  LINKEDIN
                </a>
              </div>
              <p className="tracking-widest uppercase">
                DESIGNED &amp; ENGINEERED // 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
