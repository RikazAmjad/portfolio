"use client";

import { useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { ContactTerminal } from "@/components/sections/ContactTerminal";
import { Footer } from "@/components/sections/Footer";
import { LogoRevealIntro } from "@/components/sections/LogoRevealIntro";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Liquid Glass Logo Reveal Screen — plays once on entry, then smoothly cross-fades into portfolio */}
      <LogoRevealIntro onComplete={() => setIntroComplete(true)} />

      <div
        className="relative w-full flex flex-col"
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          pointerEvents: introComplete ? "auto" : "none",
        }}
      >
        {/* Act I: The Transmission & 3D Crystalline Monolith */}
        <HeroSection />

        {/* Act II: Spatial Exploration, Manifesto & 4-Tier Architectural Anatomy */}
        <PhilosophySection />

        {/* Act III: Selected Works, Continuous Cyan Circuit & 3D Tilt Masonry */}
        <SelectedWorks />

        {/* Act IV: Engineering Storyline Timeline */}
        <TimelineSection />

        {/* Act V: Vouched Field Notes & Peer Endorsements */}
        <SocialProof />

        {/* Act VI: Kinetic Rotating Typography & Interactive Dispatch Terminal */}
        <ContactTerminal />

        {/* Footer: Directory, Operations, UTC Clock & Back to Top */}
        <Footer />
      </div>
    </>
  );
}
