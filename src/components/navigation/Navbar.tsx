"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
        className="fixed inset-x-0 top-0 z-50 w-full pointer-events-none mix-blend-difference"
      >
        <nav className="mx-auto flex w-full max-w-[94rem] items-center justify-between px-6 py-6 md:px-12 pointer-events-auto">
          {/* Monogram Brandmark */}
          <a
            href="#"
            data-magnetic="true"
            aria-label="Rikaz Amjad Home"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-md">
              <span className="font-mono text-xs font-black tracking-tighter text-white">
                RA
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-mono text-[11px] font-bold tracking-widest text-white uppercase">
                RIKAZ AMJAD
              </span>
              <span className="font-mono text-[9px] tracking-wider text-white/60 uppercase">
                software engineer
              </span>
            </div>
          </a>

          {/* Magnetic Hamburger Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-magnetic="true"
            aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 p-3 outline-none backdrop-blur-md transition-colors hover:border-white/40"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-5 bg-white origin-center"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-5 bg-white origin-center"
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#370232]/95 p-8 md:p-16 backdrop-blur-2xl text-white"
          >
            {/* <div className="flex justify-between items-center max-w-[94rem] mx-auto w-full pt-16">
              <span className="font-mono text-xs tracking-widest text-[#FFD000] uppercase">
                System Directory
              </span>
            </div> */}

            <div className="flex flex-col gap-6 md:gap-8 max-w-[94rem] mx-auto w-full py-12">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  data-cursor-text="GOTO"
                  className="group flex items-baseline gap-4 md:gap-8 text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white/90 hover:text-[#FFD000] transition-colors"
                >
                  <span className="font-mono text-xs sm:text-sm font-light text-white/40 group-hover:text-[#FFD000]">
                    ({item.num})
                  </span>
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 max-w-[94rem] mx-auto w-full border-t border-white/10 pt-6 font-mono text-xs text-white/50">
              <p>Distributed Systems Architecture & Creative Engineering</p>
              <div className="flex items-center gap-6">
                <a href="https://collection.cloudinary.com/drv7bdv3u/ea464e18e9a39382a0689e4b31b79623" target="_blank" rel="noreferrer" className="text-[#FFD000] hover:underline font-bold transition-colors">CV / Resume ↗</a>
                <a href="https://github.com/RikazAmjad" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="mailto:rikazamjad@gmail.com" className="hover:text-white transition-colors">Email</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
