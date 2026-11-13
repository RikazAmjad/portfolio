"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkillDomain {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  year: string;
  image: string;
  skills: string[];
}

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    subtitle: "High-performance web applications, fluid design systems, and responsive architectures.",
    tag: "UI & Client",
    year: "2024–2026",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
    skills: ["React", "Next.js 15", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "backend",
    title: "Backend Architecture",
    subtitle: "Scalable RESTful & GraphQL APIs, microservices, and secure authentication flows.",
    tag: "APIs & Services",
    year: "2024–2026",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    skills: ["Node.js", "Express", "Python", "API Security"],
  },
  {
    id: "databases",
    title: "Databases & Persistence",
    subtitle: "Relational schema design, caching layers, and high-throughput query optimization.",
    tag: "Data & Storage",
    year: "2023–2026",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
  },
  {
    id: "devops",
    title: "DevOps & Tooling",
    subtitle: "Automated CI/CD pipelines, containerization, Git workflows, and cloud deployments.",
    tag: "Ship & Cloud",
    year: "2023–2026",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80",
    skills: ["Docker", "GitHub Actions", "AWS / Vercel", "Linux"],
  },
];

interface CursorSkillsProps {
  domains?: SkillDomain[];
  className?: string;
}

export function CursorSkills({ domains = SKILL_DOMAINS, className }: CursorSkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Mouse tracking with fluid spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 240, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full rounded-3xl bg-[#370232] text-white p-6 sm:p-10 md:p-14 overflow-hidden border border-white/10 select-none shadow-2xl",
        className
      )}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#FFD000_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* ── Magnetic Floating Image Preview (Tracks Cursor) ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          top: 0,
          left: 0,
        }}
        animate={{
          opacity: activeIdx !== null ? 1 : 0,
          scale: activeIdx !== null ? 1 : 0.75,
          rotate: activeIdx !== null ? (activeIdx % 2 === 0 ? 1.5 : -1.5) : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="pointer-events-none absolute z-40 hidden md:block -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div className="relative w-72 sm:w-84 md:w-96 h-44 sm:h-52 md:h-60 rounded-2xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] bg-[#240121] backdrop-blur-md">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{
                opacity: activeIdx === index ? 1 : 0,
                scale: activeIdx === index ? 1 : 1.08,
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <img
                src={domain.image}
                alt={domain.title}
                className="w-full h-full object-cover"
              />
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* Card metadata label */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white font-mono text-[11px]">
                <span className="font-bold tracking-wider uppercase text-[#FFD000]">
                  {domain.tag}
                </span>
                <span className="text-white/80">{domain.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 4 Skills List ── */}
      <div className="relative z-10 flex flex-col divide-y divide-white/10">
        {domains.map((domain, index) => {
          const isActive = activeIdx === index;
          const isDimmed = activeIdx !== null && !isActive;

          return (
            <div
              key={domain.id}
              onMouseEnter={() => setActiveIdx(index)}
              className={cn(
                "group relative cursor-pointer py-6 sm:py-8 md:py-10 px-4 sm:px-6 rounded-2xl transition-all duration-300",
                isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.03]",
                isDimmed ? "opacity-35" : "opacity-100"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Title + Arrow + Subtitle */}
                <div className="flex flex-col gap-1.5 flex-1 max-w-2xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white transition-colors">
                      {domain.title}
                    </h3>
                    <ArrowUpRight
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300",
                        isActive
                          ? "text-[#FFD000] opacity-100 translate-x-1 -translate-y-1 scale-110"
                          : "text-white/40 opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </div>

                  <p className="text-sm sm:text-base text-neutral-400 font-sans font-normal leading-relaxed">
                    {domain.subtitle}
                  </p>

                  {/* Tech stack pills (subtle in row) */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {domain.skills.map((skill) => (
                      <span
                        key={skill}
                        className={cn(
                          "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-[#FFD000]/20 text-[#FFD000] border border-[#FFD000]/30"
                            : "bg-white/5 text-neutral-400 border border-white/5"
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Year / Category Tag */}
                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-1 font-mono text-xs sm:text-sm">
                  <span
                    className={cn(
                      "font-semibold transition-colors duration-200",
                      isActive ? "text-[#FFD000]" : "text-neutral-400"
                    )}
                  >
                    {domain.year}
                  </span>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-widest hidden sm:inline">
                    {domain.tag}
                  </span>
                </div>
              </div>

              {/* Mobile-only inline preview thumbnail (since cursor hover is unavailable on touch) */}
              <div className="mt-4 md:hidden overflow-hidden rounded-xl h-36 w-full relative">
                <img
                  src={domain.image}
                  alt={domain.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#FFD000] uppercase tracking-wider">
                  {domain.tag}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CursorSkills;
