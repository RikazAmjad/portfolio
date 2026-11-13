"use client";

import Timeline from "@/components/ui/timeline";

const settings = {
  textColor: "#F2EEE5",
  mutedTextColor: "#D1B8CE",
  activeColor: "#FFD000",
  backgroundColor: "#370232",
  duration: 1.4,
};

export default function TimelineDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <main className="bg-[#370232] text-[#F2EEE5]">
      {/* Lead-in so the pinned timeline has somewhere to scroll in from. */}
      <section className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#D1B8CE]">
          Engineering Storyline
        </p>
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight tracking-tight sm:text-6xl font-['Hobeaux',cursive,sans-serif]">
          Six years, one continuous architecture.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-[#D1B8CE]">
          Keep scrolling — the section pins, the track slides sideways, and each
          milestone draws its stem and reveals its copy as it reaches centre.
        </p>
        <span className="mt-2 animate-bounce text-[#FFD000]">&darr;</span>
      </section>

      {/* Realistic usage: custom copy, a branded accent, tuned reveal speed. */}
      <Timeline
        title="Engineering Story"
        periodLabel="2020 — 2026"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        imageUrl="/coding.jpg"
        imageAlt="Rikaz Amjad engineering workspace"
        duration={s.duration}
      />

      <section className="flex h-screen items-center justify-center px-6 text-center text-sm text-[#D1B8CE]">
        From low-level systems research to globally resilient production platforms.
      </section>
    </main>
  );
}

