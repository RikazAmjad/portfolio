"use client";

import { useState } from "react";
import { GlobeBars, type BarMarker } from "@/components/ui/cobe-globe-bars";
import { Testimonials } from "@/components/ui/testimonials-13";

const globeReviews: BarMarker[] = [
  {
    id: "review-pk",
    location: [31.5204, 74.3587],
    value: 99,
    rating: 5,
    label: "PK",
    review: "Zero Race Conditions",
    fullReview: "Architected high-concurrency order pipeline and inventory sync across multi-city fulfillment hubs with zero concurrency deadlocks.",
    city: "Lahore, Pakistan",
    author: "Muhammad Haris",
    company: "MH Tex Group",
  },
  {
    id: "review-uae",
    location: [25.2048, 55.2708],
    value: 100,
    rating: 5,
    label: "UAE",
    review: "Doorstep Geo-Dispatch",
    fullReview: "Engineered on-demand pickup & delivery platform with ArcGIS geospatial routing, booking flow, and automated invoice dispatch.",
    city: "Dubai, UAE",
    author: "Muhammad Ali Raza",
    company: "WashWell Logistics",
  },
  {
    id: "review-makkah",
    location: [21.3891, 39.8579],
    value: 98,
    rating: 5,
    label: "MAK",
    review: "Instant Cart Sync",
    fullReview: "Built culinary ordering platform with instantaneous cart sync, sub-50ms checkout transitions, and zero payment drop during peak volume.",
    city: "Makkah, Arabia",
    author: "Waseem Afzal",
    company: "MadinaBites",
  },
  {
    id: "review-swiss",
    location: [47.3769, 8.5417],
    value: 97,
    rating: 5,
    label: "CH",
    review: "Clean Supabase Engine",
    fullReview: "Delivered global textile merchandising platform with lightning-fast edge filtering, clean Supabase architecture, and automated inquiry dispatch.",
    city: "Zurich, Switzerland",
    author: "Omer",
    company: "CoAdverts",
  },
  {
    id: "review-spain",
    location: [40.4168, -3.7038],
    value: 98,
    rating: 5,
    label: "ES",
    review: "Bilingual PWA Menu",
    fullReview: "Developed bilingual (Spanish/English) progressive web app with seamless offline menu caching, responsive mobile ordering, and zero friction.",
    city: "Madrid, Spain",
    author: "Carlos Mendez",
    company: "CostoComida",
  },
  {
    id: "review-uk",
    location: [51.5074, -0.1278],
    value: 96,
    rating: 5,
    label: "UK",
    review: "Sub-ms P95 Latency",
    fullReview: "Re-architected distributed streaming pipeline in Rust. Zero dropped frames since launch with sub-millisecond p95 latency.",
    city: "London, United Kingdom",
    author: "Elena Rostova",
    company: "Aura Network",
  },
];

export function SocialProof() {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const activeMarker = globeReviews.find((m) => m.id === activeMarkerId);

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
            <span className="ml-2 text-black/40">(06)</span>
          </div>

          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#370232] leading-[0.95]">
            Vouched Worldwide
          </h2>

          <p className="mt-4 max-w-2xl font-sans text-sm md:text-base text-[#744470] leading-relaxed">
            Direct observations and verified client reviews from founders and engineering leaders across Pakistan, the UAE, Makkah (Arabia), Switzerland, Spain, and the UK. Drag to spin the globe.
          </p>
        </div>

        {/* Centered 3D Cobe Globe */}
        <div className="relative w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] aspect-square flex items-center justify-center my-2 sm:my-4">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-50 blur-3xl bg-gradient-to-tr from-[#FFD000]/25 via-[#370232]/10 to-transparent"
            aria-hidden="true"
          />

          <GlobeBars
            markers={globeReviews}
            activeMarkerId={activeMarkerId ?? undefined}
            targetLocation={activeMarker ? activeMarker.location : null}
            onSelectMarker={(m) => {
              setActiveMarkerId((prev) => (prev === m.id ? null : m.id));
            }}
            baseColor={[0.96, 0.94, 0.91]}
            markerColor={[1, 0.82, 0]}
            glowColor={[0.98, 0.96, 0.92]}
            arcColor={[1, 0.82, 0]}
            dark={0}
            speed={0.0025}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Testimonials Marquee Animation of Cards Below the Globe */}
      <div className="relative z-10 w-full mt-4 pb-16 sm:pb-24 md:pb-32">
        <Testimonials />
      </div>
    </section>
  );
}

export default SocialProof;
