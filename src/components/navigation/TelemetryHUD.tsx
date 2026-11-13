"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

export function TelemetryHUD() {
  const [time, setTime] = useState("");
  const [scrollPercent, setScrollPercent] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) {
      sound.playClick();
    }
  };

  useEffect(() => {
    // Real-time UTC clock ticker
    const updateTime = () => {
      const now = new Date();
      setTime(now.toTimeString().split(" ")[0] + " UTC");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Scroll progress listener
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.round((window.scrollY / total) * 100) : 0;
      setScrollPercent(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <aside
      aria-label="System Telemetry"
      className="fixed inset-x-0 bottom-0 z-40 w-full pointer-events-none"
    >
      <div className="mx-auto flex w-full max-w-[94rem] items-center justify-between px-4 py-2.5 sm:px-8 sm:py-3 md:px-12 bg-[#370232]/85 backdrop-blur-xl border-t border-white/10 font-mono text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-widest text-[#D1B8CE] uppercase pointer-events-auto shadow-2xl">
        {/* Left: UTC Time & Node Status */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#F2EEE5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD000] animate-pulse" />
            <span>{time || "00:00:00 UTC"}</span>
          </span>
          <span className="hidden sm:inline text-white/20">/</span>
          <span className="hidden lg:inline text-white/50">LATENCY: 14MS P95</span>
        </div>

        {/* Center: Live Scroll Progress Meter */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-white/50">PROGRESS:</span>
          <div className="h-1.5 w-16 sm:w-24 md:w-32 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#FFD000] transition-all duration-150 ease-out"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
          <span className="text-[#FFD000] font-bold w-6 sm:w-8 text-right">
            {scrollPercent}%
          </span>
        </div>

        {/* Right: Sound FX Toggle & Status */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-white/40">WEBGL/R3F</span>
          <button
            onClick={toggleSound}
            data-magnetic="true"
            aria-label={soundEnabled ? "Disable interface audio cues" : "Enable interface audio cues"}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[8px] sm:text-[9px] hover:border-[#FFD000] transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3 w-3 text-[#FFD000]" />
                <span className="text-[#FFD000]">AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3 w-3 text-white/40" />
                <span className="text-white/50">MUTE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
