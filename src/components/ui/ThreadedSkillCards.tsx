"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface SkillCardData {
  id: string;
  number: string;
  badge?: string;
  badgeGradient?: string;
  badgeTextColor?: string;
  category: string;
  title: string;
  subtitle: string;
  skills: string[];
  bgColor: string;
  textColor: string;
  chipBg: string;
  chipText: string;
  tilt: number; // static tilt angle in degrees from reference
  leftX: number; // position on track in px
  topY: number;
}

const CARDS: SkillCardData[] = [
  {
    id: "frontend",
    number: "01",
    badge: "Free 15 min call",
    badgeGradient: "from-[#FF4E50] via-[#F857A6] to-[#FF5858]",
    badgeTextColor: "text-white",
    category: "FRONTEND SYSTEMS",
    title: "DISCOVERY",
    subtitle:
      "A deep dive into your product vision. High-performance interfaces, fluid motion systems, Next.js 16, and accessible responsive architecture.",
    skills: ["React 19", "Next.js", "TypeScript", "Tailwind v4"],
    bgColor: "#D4FF00", // Lime neon from reference
    textColor: "#140112", // Deep plum/black text for high tactile contrast
    chipBg: "rgba(20, 1, 18, 0.12)",
    chipText: "#140112",
    tilt: -3.5,
    leftX: 320,
    topY: 260,
  },
  {
    id: "backend",
    number: "02",
    category: "BACKEND ARCHITECTURE",
    title: "DESIGN",
    subtitle:
      "Scalable RESTful & GraphQL microservices, async event loops, zero-copy serialization, and secure authentication flows.",
    skills: ["Node.js", "Express", "Python", "API Security"],
    bgColor: "#FF5CA8", // Bubblegum pink from reference
    textColor: "#FFFFFF",
    chipBg: "rgba(255, 255, 255, 0.22)",
    chipText: "#FFFFFF",
    tilt: 2.8,
    leftX: 1200,
    topY: 270,
  },
  {
    id: "databases",
    number: "03",
    category: "DATA & PERSISTENCE",
    title: "BUILD",
    subtitle:
      "Relational schema design, caching topologies, analytical columnar storage, and query optimization for high-concurrency throughput.",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
    bgColor: "#227BFF", // Electric blue from reference
    textColor: "#FFFFFF",
    chipBg: "rgba(255, 255, 255, 0.22)",
    chipText: "#FFFFFF",
    tilt: -2.2,
    leftX: 2140,
    topY: 280,
  },
  {
    id: "devops",
    number: "04",
    badge: "It's live!",
    badgeGradient: "from-[#00c6ff] to-[#0072ff]",
    badgeTextColor: "text-white",
    category: "DEVOPS & CLOUD",
    title: "LAUNCH",
    subtitle:
      "Automated zero-downtime CI/CD pipelines, Docker containerization, AWS & Vercel edge deployment, and ongoing observability after shipping.",
    skills: ["Docker", "GitHub Actions", "AWS / Vercel", "Linux"],
    bgColor: "#FF4D1C", // Vivid coral orange from reference
    textColor: "#FFFFFF",
    chipBg: "rgba(255, 255, 255, 0.22)",
    chipText: "#FFFFFF",
    tilt: 3.2,
    leftX: 3020,
    topY: 275,
  },
];

// C1-Continuous Ultra-Smooth Catenary Spline Segments:
// The string exists ONLY between cards and out to the page edges.
// Behind each card, the string is completely omitted so it is 100% impossible to bleed through.
const STRING_PATH = [
  // Segment 0: Left corner of page into Card 01 (tucks 25px under left edge at 345)
  "M 0,220 C 110,230 230,250 345,260",

  // Segment 1: Right edge of Card 01 (emerges at 675) across Empty Space 1 into Card 02 (tucks at 1225)
  "M 675,260 C 785,250 860,325 940,325 C 1020,325 1115,255 1225,270",

  // Segment 2: Right edge of Card 02 (emerges at 1555) across Empty Space 2 past Sparkle Star (1850) into Card 03 (tucks at 2165)
  "M 1555,270 C 1665,255 1760,240 1850,240 C 1940,240 2055,265 2165,280",

  // Segment 3: Right edge of Card 03 (emerges at 2495) across Empty Space 3 into Card 04 (tucks at 3045)
  "M 2495,280 C 2605,265 2680,330 2760,330 C 2840,330 2935,260 3045,275",

  // Segment 4: Right edge of Card 04 (emerges at 3375) across full screen width to right end of page (5400)
  "M 3375,275 C 3520,255 3680,240 3850,245 C 4020,250 4180,295 4350,295 C 4520,295 4680,250 4850,250 C 5020,250 5200,265 5400,265",
].join(" ");

export function ThreadedSkillCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll through the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  // Calibrated horizontal pan:
  // Glides across cards and STOPS once Card 04 is centered.
  // Card 04 never disappears from view!
  const trackX = useTransform(
    smoothProgress,
    [0.0, 0.10, 0.35, 0.50, 0.68, 0.88, 1.0],
    ["0px", "0px", "-880px", "-1400px", "-1820px", "-2500px", "-2500px"]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh] select-none"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A000A] text-white flex flex-col justify-between pt-20 pb-10 md:pt-24 md:pb-12 shadow-[inset_0_0_140px_rgba(0,0,0,0.9)]">
        
        {/* ── LIGHT CURVED TOP BOUNDARY (Gentle organic curve spanning full page width) ── */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none">
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-14 md:h-18"
          >
            <path
              d="M 0,0 L 1440,0 L 1440,16 Q 720,60 0,16 Z"
              fill="#F2EEE5"
            />
            <path
              d="M 0,16 Q 720,60 1440,16"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        {/* ── LIGHT CURVED BOTTOM BOUNDARY (Gentle organic curve spanning full page width) ── */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none">
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-14 md:h-18"
          >
            <path
              d="M 0,64 L 1440,64 L 1440,48 Q 720,4 0,48 Z"
              fill="#F2EEE5"
            />
            <path
              d="M 0,48 Q 720,4 1440,48"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Subtle Ambient Radial Glows */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 20% 40%, #D4FF00 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 60%, #FF5CA8 0%, transparent 60%)",
            filter: "blur(90px)",
          }}
          aria-hidden="true"
        />

        {/* Section HUD Header */}
        <div className="relative z-20 mx-auto w-full max-w-[94rem] px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#D4FF00] animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-[#A3849F] uppercase">
              Architecture Pipeline // Continuous Thread
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#A3849F]">
            <span>(SCROLL TO WEAVE)</span>
            <span className="text-[#D4FF00]">↓</span>
          </div>
        </div>

        {/* Horizontal Scrolling Canvas Stage */}
        <div className="relative z-10 w-full flex-1 flex items-center overflow-visible">
          <motion.div
            style={{ x: trackX }}
            className="relative flex items-center h-[560px] w-[5400px] shrink-0"
          >
            {/* ── THE CONTINUOUS WHITE STRING (Behind cards at z-10; completely omitted behind card bodies) ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              viewBox="0 0 5400 560"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ultra-Smooth Glowing White String */}
              <path
                d={STRING_PATH}
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] drop-shadow-[0_0_24px_rgba(255,255,255,0.5)]"
              />
            </svg>

            {/* ── FLOATING 4-POINT SPARKLE STAR (In Empty Space between Card 02 & Card 03) ── */}
            <SparkleStar progress={smoothProgress} />

            {/* ── 4 TACTILE CARDS (Solid opaque at z-20, smooth spring appearance) ── */}
            {CARDS.map((card, idx) => {
              const revealStarts = [0.00, 0.28, 0.60, 0.80];
              const cardStart = revealStarts[idx];

              return (
                <ThreadedCard
                  key={card.id}
                  card={card}
                  index={idx}
                  progress={smoothProgress}
                  revealStart={cardStart}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Pipeline Progress Indicator */}
        <div className="relative z-20 mx-auto w-full max-w-[94rem] px-6 md:px-12 flex items-center justify-between font-mono text-xs text-[#A3849F]">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-widest uppercase">Pipeline Stages</span>
            <div className="flex gap-2">
              {CARDS.map((c, i) => (
                <PipelineDot key={c.id} index={i} progress={smoothProgress} />
              ))}
            </div>
          </div>
          <span className="hidden sm:inline">END-TO-END SYSTEM CRAFT</span>
        </div>
      </div>
    </div>
  );
}

// Individual Solid Tactile Card with Smooth Animated Entrance
function ThreadedCard({
  card,
  index,
  progress,
  revealStart,
}: {
  card: SkillCardData;
  index: number;
  progress: ReturnType<typeof useSpring>;
  revealStart: number;
}) {
  const isFirst = index === 0;

  // Card 01 is solid and settled immediately; Cards 02-04 glide in with smooth spring animation
  const opacity = useTransform(
    progress,
    isFirst ? [0, 0.01] : [revealStart - 0.08, revealStart + 0.02],
    isFirst ? [1, 1] : [0, 1]
  );
  const scale = useTransform(
    progress,
    isFirst ? [0, 0.01] : [revealStart - 0.08, revealStart + 0.04],
    isFirst ? [1, 1] : [0.86, 1]
  );
  const y = useTransform(
    progress,
    isFirst ? [0, 0.01] : [revealStart - 0.08, revealStart + 0.04],
    isFirst ? [0, 0] : [50, 0]
  );
  const rotate = useTransform(
    progress,
    isFirst ? [0, 0.01] : [revealStart - 0.08, revealStart + 0.04],
    isFirst ? [card.tilt, card.tilt] : [0, card.tilt]
  );

  return (
    <motion.div
      style={{
        backgroundColor: card.bgColor,
        color: card.textColor,
        left: card.leftX,
        top: card.topY - 240, // center vertically around string
        opacity,
        scale,
        y,
        rotate,
      }}
      className={cn(
        "absolute z-20 w-[310px] sm:w-[350px] md:w-[380px] h-[480px] md:h-[500px]",
        "rounded-[32px] md:rounded-[36px] p-7 md:p-8 flex flex-col justify-between",
        "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-black/10 select-none cursor-pointer",
        "transition-transform duration-300 hover:scale-[1.03] hover:rotate-0"
      )}
    >
      {/* Top Bar: Number + Optional Floating Badge (Clean, no marks on edges) */}
      <div className="flex items-start justify-between relative">
        <span className="font-mono text-sm md:text-base font-bold tracking-tight opacity-75">
          {card.number}
        </span>

        {/* Tilted Sticker Capsule Badge */}
        {card.badge && (
          <div
            className={cn(
              "px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold tracking-wide shadow-xl border-2 border-white",
              "bg-gradient-to-r rotate-[6deg] -mr-4 -mt-3",
              card.badgeGradient,
              card.badgeTextColor
            )}
          >
            {card.badge}
          </div>
        )}
      </div>

      {/* Middle: Category & Large Punchy Title & Subtitle */}
      <div className="my-auto flex flex-col gap-2.5">
        <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-widest opacity-75 uppercase">
          {card.category}
        </span>
        <h4 className="font-sans text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase">
          {card.title}
        </h4>
        <p className="font-sans text-xs md:text-sm font-medium leading-relaxed opacity-85 mt-1">
          {card.subtitle}
        </p>
      </div>

      {/* Bottom: Skill Chips (Clean, no dividing line) */}
      <div className="flex flex-wrap gap-1.5 pt-4">
        {card.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold"
            style={{
              backgroundColor: card.chipBg,
              color: card.chipText,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// 4-Point Sparkle Star between Card 02 and Card 03
function SparkleStar({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const scale = useTransform(progress, [0.42, 0.50, 0.58], [0, 1.35, 1]);
  const rotate = useTransform(progress, [0.42, 0.65], [0, 180]);
  const opacity = useTransform(progress, [0.40, 0.46, 0.62, 0.68], [0, 1, 1, 0.4]);

  return (
    <motion.div
      style={{
        left: 1850,
        top: 210,
        scale,
        rotate,
        opacity,
      }}
      className="absolute z-15 w-16 h-16 flex items-center justify-center pointer-events-none"
    >
      <svg
        className="w-16 h-16 filter drop-shadow-[0_0_20px_#D4FF00] drop-shadow-[0_0_35px_#00F2FE]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"
          fill="url(#starGradient)"
        />
        <defs>
          <linearGradient id="starGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4FF00" />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#00F2FE" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Pipeline Dot in the bottom indicator bar
function PipelineDot({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const thresholds = [0.05, 0.30, 0.62, 0.82];
  const isActive = useTransform(progress, (v) => v >= thresholds[index]);

  return (
    <motion.div
      className={cn(
        "h-1.5 rounded-full transition-all duration-300",
        "w-6 bg-white/20"
      )}
      style={{
        backgroundColor: useTransform(isActive, (active) =>
          active ? "#D4FF00" : "rgba(255, 255, 255, 0.2)"
        ),
      }}
    />
  );
}
