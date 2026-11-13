import { HeroSection } from "@/components/sections/HeroSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { ContactTerminal } from "@/components/sections/ContactTerminal";
import { Footer } from "@/components/sections/Footer";
// import { ScrollThread } from "@/components/ui/ScrollThread";

export default function HomePage() {
  return (
    <div className="relative w-full flex flex-col">
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

      {/* Continuous scroll-drawn thread running through every section after the hero */}
      {/* <ScrollThread /> */}
    </div>
  );
}
