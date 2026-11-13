"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { usePreloader } from "@/components/providers/PreloaderProvider";

export function AppPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const { setPreloaderFinished } = usePreloader();

  const handleAnimationComplete = () => {
    // Brief delay to appreciate the completed handwritten "hello"
    setTimeout(() => {
      setPreloaderFinished(true);
      setIsLoading(false);
    }, 280);
  };

  // Fallback safety timeout so user is never blocked
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setPreloaderFinished(true);
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(safetyTimer);
  }, [setPreloaderFinished]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="app-preloader"
          data-testid="app-preloader"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#370232] text-[#FFD000] pointer-events-auto select-none overflow-hidden"
        >
          {/* Subtle ambient radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,208,0,0.12),transparent_65%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center px-6">
            <AppleHelloEnglishEffect
              speed={0.8}
              className="w-[280px] sm:w-[400px] md:w-[520px] h-auto text-[#FFD000] drop-shadow-[0_0_35px_rgba(255,208,0,0.45)]"
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
