"use client";

import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { useRef, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
  number?: string;
  category?: string;
  badge?: string;
  skills?: string[];
  textColor?: string;
}

export interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  number?: string;
  category?: string;
  badge?: string;
  skills?: string[];
  textColor?: string;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
  number,
  category,
  badge,
  skills,
  textColor,
}: CardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  const isLightCard = color === "#FFD000" || color === "#F2EEE5" || textColor === "#370232" || textColor === "#140112";
  const mainTextClass = isLightCard ? "text-[#370232]" : "text-[#F2EEE5]";
  const mutedTextClass = isLightCard ? "text-[#370232]/80" : "text-[#F2EEE5]/80";
  const borderClass = isLightCard ? "border-[#370232]/15 shadow-[0_20px_50px_rgba(55,2,50,0.18)]" : "border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.5)]";
  const chipBgClass = isLightCard ? "bg-[#370232]/10 text-[#370232] border border-[#370232]/10" : "bg-white/15 text-[#F2EEE5] border border-white/10";

  return (
    <div
      ref={container}
      className="min-h-screen flex items-center justify-center sticky top-0 py-8 px-4 sm:px-6"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(7vh + ${i * 28}px)`,
        }}
        className={cn(
          "flex flex-col relative w-full max-w-[1020px] rounded-3xl p-6 sm:p-8 md:p-10 origin-top shadow-[0_24px_60px_rgba(0,0,0,0.35)] border overflow-hidden",
          borderClass
        )}
      >
        {/* Top Card Meta Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-3">
            <span className={cn("font-mono text-sm sm:text-base font-black tracking-widest", mainTextClass)}>
              {number || `0${i + 1}`}
            </span>
            {category && (
              <span className={cn("font-mono text-xs font-semibold tracking-widest uppercase opacity-75", mainTextClass)}>
                // {category}
              </span>
            )}
          </div>

          {badge && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase shadow-sm",
                isLightCard
                  ? "bg-[#370232]/10 text-[#370232] border border-[#370232]/15"
                  : "bg-[#FFD000]/20 text-[#FFD000] border border-[#FFD000]/30"
              )}
            >
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-6 items-stretch">
          {/* Left Column: Title & Description */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase leading-[1.05] font-['Hobeaux',cursive,sans-serif]", mainTextClass)}>
                {title}
              </h2>
              <p className={cn("text-sm sm:text-base leading-relaxed", mutedTextClass)}>
                {description}
              </p>
            </div>

            {/* Skills & CTA */}
            <div className="pt-6 space-y-4">
              {skills && skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-sm",
                        chipBgClass
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <a
                  href="#contact"
                  className={cn(
                    "inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase underline underline-offset-4 transition-transform hover:translate-x-1",
                    isLightCard
                      ? "text-[#370232] hover:text-[#744470]"
                      : "text-[#FFD000] hover:text-[#F2EEE5]"
                  )}
                >
                  Explore System
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Scaled Preview */}
          <div className="lg:col-span-7 relative h-[240px] sm:h-[300px] md:h-[340px] rounded-2xl overflow-hidden border border-black/10 shadow-inner">
            <motion.div className="w-full h-full" style={{ scale: imageScale }}>
              <img
                src={url}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export interface StackingCardsProps {
  projects?: ProjectData[];
  className?: string;
}

export const SKILL_CARDS_DATA: ProjectData[] = [
  {
    number: "01",
    category: "FRONTEND SYSTEMS",
    title: "DISCOVERY",
    badge: "Free 15 min call",
    description:
      "A deep dive into your product vision. High-performance interfaces, fluid motion systems, Next.js 16, TypeScript, and accessible responsive architecture.",
    skills: ["React 19", "Next.js", "TypeScript", "Tailwind v4", "Three.js"],
    link: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    color: "#FFD000", // Signature Electric Gold
    textColor: "#370232",
  },
  {
    number: "02",
    category: "BACKEND ARCHITECTURE",
    title: "DESIGN",
    description:
      "Scalable RESTful & GraphQL microservices, async event loops, zero-copy serialization, and secure authentication flows.",
    skills: ["Node.js", "Express", "Python", "API Security", "GraphQL"],
    link: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    color: "#370232", // Signature Deep Plum Base
    textColor: "#F2EEE5",
  },
  {
    number: "03",
    category: "DATA & PERSISTENCE",
    title: "BUILD",
    description:
      "Relational schema design, caching topologies, analytical columnar storage, and query optimization for high-concurrency throughput.",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "BigQuery"],
    link: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
    color: "#F2EEE5", // Signature Warm Archival Cream
    textColor: "#370232",
  },
  {
    number: "04",
    category: "DEVOPS & CLOUD",
    title: "LAUNCH",
    badge: "It's live!",
    description:
      "Automated zero-downtime CI/CD pipelines, Docker containerization, AWS & Vercel edge deployment, and ongoing observability after shipping.",
    skills: ["Docker", "GitHub Actions", "AWS / Vercel", "Linux", "Kubernetes"],
    link: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    color: "#744470", // Signature Amethyst Elevated Plum
    textColor: "#F2EEE5",
  },
];

const Component = forwardRef<HTMLElement, StackingCardsProps>(
  ({ projects = SKILL_CARDS_DATA, className }, ref) => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ["start start", "end end"],
    });

    return (
      <div
        ref={container}
        className={cn(
          "relative w-full bg-[#140112] text-white pt-16 pb-24 overflow-visible rounded-3xl md:rounded-[48px] shadow-[inset_0_2px_40px_rgba(0,0,0,0.6)]",
          className
        )}
      >
        {/* Subtle Background Radial & Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(116,68,112,0.18),transparent_60%)] pointer-events-none rounded-3xl md:rounded-[48px]" />

        {/* Section Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold tracking-widest text-[#FFD000] uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse" />
            ( 02 // TECHNICAL SKILL SET & CAPABILITIES )
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F2EEE5] uppercase font-['Hobeaux',cursive,sans-serif]">
            <span className="siglitos-pop-white">Core Engineering Stack</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-[#D1B8CE] leading-relaxed font-sans">
            Scroll down to inspect the full-stack architecture deck. Each layer scales and stacks cleanly into a cohesive engineering system.
          </p>
        </div>

        {/* Stack of Sticky Cascading Cards */}
        <div className="relative w-full">
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.04;
            return (
              <Card
                key={`skill_card_${i}`}
                i={i}
                url={project.link}
                title={project.title}
                color={project.color}
                description={project.description}
                number={project.number}
                category={project.category}
                badge={project.badge}
                skills={project.skills}
                textColor={project.textColor}
                progress={scrollYProgress}
                range={[i * 0.22, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

Component.displayName = "StackingCards";

export default Component;
export { Component as StackingCards };

