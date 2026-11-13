"use client";

import { GlobeBars, type BarMarker } from "@/components/ui/cobe-globe-bars";
import { Testimonials } from "@/components/ui/testimonials-13";

const globeReviews: BarMarker[] = [
  {
    id: "review-sf",
    location: [37.77, -122.42],
    value: 99,
    rating: 5,
    label: "SF",
    review: "Exceptional speed and craft",
    city: "San Francisco",
    author: "Marcus Chen",
    company: "HyperFlow Labs",
  },
  {
    id: "review-nyc",
    location: [40.71, -74.01],
    value: 96,
    rating: 5,
    label: "NYC",
    review: "Sub-5ms ultra-low latency",
    city: "New York",
    author: "David Sterling",
    company: "Vortex Trading",
  },
  {
    id: "review-ldn",
    location: [51.51, -0.13],
    value: 94,
    rating: 5,
    label: "LDN",
    review: "Zero dropped frames in production",
    city: "London",
    author: "Elena Rostova",
    company: "Aura Network",
  },
  {
    id: "review-ber",
    location: [52.52, 13.40],
    value: 100,
    rating: 5,
    label: "BER",
    review: "Pixel-perfect modular design systems",
    city: "Berlin",
    author: "Snow Dream Studios Team",
    company: "Snow Dream Studios",
  },
  {
    id: "review-tky",
    location: [35.68, 139.65],
    value: 98,
    rating: 5,
    label: "TKY",
    review: "Flawless distributed architecture",
    city: "Tokyo",
    author: "MilestoneZero Engineering",
    company: "MilestoneZero",
  },
];

export function SocialProof() {
  return (
    <section
      id="notes"
      className="relative w-full bg-[#F2EEE5] text-[#370232] pt-20 pb-24 md:pt-28 md:pb-32 min-h-screen z-20 border-t border-black/10 overflow-hidden flex flex-col items-center"
    >
      {/* Background Dot Pattern matching Light Chapter */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dot-grid-light z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[94rem] mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Centered Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mb-4 sm:mb-6">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-[#744470] uppercase mb-3">
            <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
            <span>GLOBAL CLIENT VOICES // FIELD REVIEWS</span>
            <span className="ml-2 text-black/40">(04)</span>
          </div>

          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#370232] leading-[0.95]">
            Vouched Worldwide
          </h2>

          <p className="mt-4 max-w-xl font-sans text-sm md:text-base text-[#744470] leading-relaxed">
            Direct observations and verified client reviews from founders and engineering leaders across global tech hubs. Drag to spin the globe.
          </p>
        </div>

        {/* Centered 3D Cobe Globe */}
        <div className="relative w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] aspect-square flex items-center justify-center my-3 sm:my-5">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-50 blur-3xl bg-gradient-to-tr from-[#FFD000]/25 via-[#370232]/10 to-transparent"
            aria-hidden="true"
          />

          <GlobeBars
            markers={globeReviews}
            baseColor={[0.96, 0.94, 0.91]}
            markerColor={[1, 0.82, 0]}
            glowColor={[0.98, 0.96, 0.92]}
            arcColor={[1, 0.82, 0]}
            dark={0}
            speed={0.0025}
            className="w-full h-full"
          />
        </div>

        {/* Status Hint Bar */}
        {/* <div className="mt-2 mb-8 flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 border border-black/10 font-mono text-xs text-[#744470] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#FFD000] animate-pulse" />
          <span className="font-semibold text-[#370232]">DRAG GLOBE TO ROTATE</span>
          <span>•</span>
          <span>5 GLOBAL HUBS ACTIVE</span>
        </div> */}
      </div>

      {/* Testimonials Marquee Animation of Cards Below the Globe */}
      <div className="relative z-10 w-full mt-4 pb-16 sm:pb-24 md:pb-32">
        <Testimonials />
      </div>
    </section>
  );
}

export default SocialProof;
