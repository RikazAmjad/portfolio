"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ExternalLink, ArrowUpRight, Terminal } from "lucide-react";
import { ProjectModal } from "./ProjectModal";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string;
  metrics: string[];
  image?: string;
  year: string;
  liveUrl?: string;
  isTerminal?: boolean;
}

const projects: ProjectItem[] = [
  {
    id: "01",
    title: "InMind Order Management System",
    category: "High-Volume E-Commerce Operations & Logistics",
    description:
      "Enterprise multi-channel order processing and dispatch orchestration platform managing 8,800+ live transactions, automated courier booking APIs, return tracking, and real-time inventory synchronization across multi-city fulfillment hubs.",
    tags: "Enterprise Platform / Next.js / TypeScript / PostgreSQL / Courier APIs / Logistics / FSM",
    metrics: ["8,847+ Orders Handled", "3,639 Dispatched", "Sub-15ms State Sync"],
    image: "/projects/oms.jpg",
    year: "2025",
  },
  {
    id: "02",
    title: "WashWell Laundry Pickup & Delivery",
    category: "On-Demand Logistics & Booking Engine",
    description:
      "Full-stack on-demand laundry and dry-cleaning logistics platform in UAE featuring automated doorstep pickup scheduling, ArcGIS geospatial dispatch, promo code engine, and automated PDF invoice generation.",
    tags: "On-Demand Logistics / Laravel / Inertia.js / React / ArcGIS / MySQL",
    metrics: ["Doorstep Geo-Dispatch", "Sub-Second Slot Booking", "Zero Drop Order Flow"],
    image: "/projects/washwell.png",
    year: "2025",
    liveUrl: "https://washwell.ae/",
  },
  {
    id: "03",
    title: "AgenticArmor CLI & Sentinel Swarm",
    category: "Autonomous AI DevSecOps & AST Compiler",
    description:
      "Terminal-based AI DevSecOps security middleware and deterministic AST compiler gate preventing prompt injection, privilege escalation, and unauthorized runtime execution in autonomous agent toolchains.",
    tags: "Terminal CLI / TypeScript / Babel AST / LangGraph / pgvector / CI/CD Gate",
    metrics: ["Sub-2ms AST Scan", "Zero Bypass Rate", "Fail-Closed CI/CD Gate"],
    year: "2024",
    isTerminal: true,
  },
  {
    id: "04",
    title: "CoAdvert Global Merchandising Platform",
    category: "Global Headless E-Commerce & Supply Chain",
    description:
      "International B2B & B2C custom textile and promotional merchandise platform bridging Scandinavian design (CoAdvert AB Sweden) with industrial manufacturing (MH Tex Pakistan), featuring dynamic product catalogs and automated inquiry routing.",
    tags: "Headless Commerce / Next.js 16 / React 19 / TypeScript / Supabase / Tailwind CSS v4 / Zod",
    metrics: ["Global Multi-Region CDN", "Sub-50ms Catalog Filter", "Automated Quoting Engine"],
    image: "/projects/coadverts.jpg",
    year: "2025",
    liveUrl: "https://coadverts.vercel.app/",
  },
];

export function SelectedWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const wordARef = useRef<HTMLSpanElement>(null);
  const wordBRef = useRef<HTMLSpanElement>(null);

  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Measure word positions to match poster widths and positions with the words
  const matchWords = useCallback(() => {
    if (!wordARef.current || !wordBRef.current || !listRef.current) return;
    const origin = listRef.current.getBoundingClientRect().left;

    const words = [wordARef.current, wordBRef.current];
    const keys = ["a", "b"];

    keys.forEach((key, n) => {
      const box = words[n].getBoundingClientRect();
      const fontSize = parseFloat(window.getComputedStyle(words[n]).fontSize) || 100;
      const bleed = fontSize * 0.02;

      const x = (box.left - bleed - origin).toFixed(1);
      const w = (box.width + bleed * 2).toFixed(1);

      listRef.current?.style.setProperty(`--${key}-x`, `${x}px`);
      listRef.current?.style.setProperty(`--${key}-w`, `${w}px`);
    });
  }, []);

  // Set up word alignment measurement & ResizeObservers
  useEffect(() => {
    matchWords();
    const handleResize = () => matchWords();
    window.addEventListener("resize", handleResize);

    const observers: ResizeObserver[] = [];
    if (typeof ResizeObserver !== "undefined") {
      if (wordARef.current) {
        const obs = new ResizeObserver(matchWords);
        obs.observe(wordARef.current);
        observers.push(obs);
      }
      if (wordBRef.current) {
        const obs = new ResizeObserver(matchWords);
        obs.observe(wordBRef.current);
        observers.push(obs);
      }
      if (listRef.current) {
        const obs = new ResizeObserver(matchWords);
        obs.observe(listRef.current);
        observers.push(obs);
      }
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(matchWords);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [matchWords]);

  // Scroll physics: Depth drift (--p) and velocity lean (--v)
  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const cardElements = Array.from(list.querySelectorAll<HTMLElement>(".work-card"));
    const cardData = cardElements.map((el, n) => ({
      el,
      media: el.querySelector<HTMLElement>(".work-card__media"),
      p: 0,
      set: "",
      drift: [0.06, -0.1, 0.04, -0.12][n % 4],
    }));

    let lean = 0;
    let leanV = 0;
    let lastY = window.scrollY;
    let lastTime: number | null = null;
    let reqId = 0;
    let onScreen = false;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onFrame = (now: number) => {
      const dt = lastTime === null ? 0.016 : Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05);
      lastTime = now;
      const height = window.innerHeight;

      if (!isReduced) {
        const speed = (window.scrollY - lastY) / dt / height;
        const target = Math.max(-1, Math.min(1, speed * 0.55));
        leanV += ((target - lean) * 60 - leanV * 12) * dt;
        lean += leanV * dt;
        list.style.setProperty("--v", lean.toFixed(4));
      }
      lastY = window.scrollY;

      // Reading line check: ~42% from the top of the viewport
      const line = height * 0.42;
      let nearestIdx: number | null = null;
      let minDistance = Infinity;

      const boxes = cardData.map((c) => c.media?.getBoundingClientRect() ?? null);

      cardData.forEach((card, i) => {
        const box = boxes[i];
        if (!box) return;
        if (box.bottom < -200 || box.top > height + 200) return;

        if (!isReduced) {
          const centre = box.top + box.height / 2 - card.p;
          const next = ((centre - height / 2) * card.drift).toFixed(1);
          if (next !== card.set) {
            card.el.style.setProperty("--p", next);
            card.set = next;
            card.p = parseFloat(next);
          }
        }

        if (box.top > height * 0.75 || box.bottom < height * 0.15) return;
        const away = Math.abs(box.top + box.height / 2 - line);
        if (away < minDistance) {
          minDistance = away;
          nearestIdx = i;
        }
      });

      setActiveProjectIdx(nearestIdx);

      const isMoving = Math.abs(window.scrollY - lastY) > 0.5 || Math.abs(lean) > 0.005;
      reqId = onScreen && !document.hidden && isMoving ? requestAnimationFrame(onFrame) : 0;
    };

    const wake = () => {
      if (reqId || !onScreen || document.hidden) return;
      lastTime = null;
      lastY = window.scrollY;
      reqId = requestAnimationFrame(onFrame);
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      wake();
    });
    io.observe(section);

    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      if (reqId) cancelAnimationFrame(reqId);
    };
  }, []);

  // Floating cursor follow inside work-card
  const handlePointerEnter = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tag-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--tag-y", `${e.clientY - box.top}px`);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tag-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--tag-y", `${e.clientY - box.top}px`);
  };

  const activeProject = activeProjectIdx !== null ? projects[activeProjectIdx] : null;

  return (
    <section
      id="works"
      ref={sectionRef}
      className="work-section relative z-20 w-full px-6 md:px-12 bg-[#F2EEE5] text-[#370232]"
      data-theme="light"
      data-work
      aria-labelledby="work-title"
    >
      {/* Mobile Distinctive Section Heading */}
      <div className="md:hidden pt-24 pb-6 flex flex-col gap-3 border-b border-black/8 mb-6">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-[#744470] uppercase">
          <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
          <span>PRODUCTION ARTIFACTS</span>
          <span className="ml-1 text-black/40">(02)</span>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-5xl siglitos-pop-white">
            Selected
          </h2>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#370232] border-2 border-[#FFD000] shadow-md">
            <svg
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-none stroke-[#FFD000] stroke-[2.8] stroke-linecap-round stroke-linejoin-round"
            >
              <polygon points="16 3 29 10.5 29 25.5 16 33 3 25.5 3 10.5 16 3" />
              <polyline points="16 3 16 18 29 10.5" />
              <polyline points="16 18 3 10.5" />
              <polyline points="16 18 16 33" />
            </svg>
          </span>
          <h2 className="font-['Hobeaux',cursive,sans-serif] text-4xl sm:text-5xl siglitos-pop-white">
            work
          </h2>
        </div>
        <p className="text-sm text-[#744470] leading-relaxed">
          Production case studies in distributed protocols, high-concurrency order state pipelines, and reactive architectures.
        </p>
      </div>

      {/* Pinned Oversized Heading Layer in Iconic Hero Hobeaux 3D Pop Typography */}
      <div className="work__stage hidden md:flex">
        <h2 className="work__title-line" id="work-title" aria-label="Selected work">
          <span className="line__word" ref={wordARef} aria-hidden="true">
            <span className="siglitos-pop-white">Selected</span>
          </span>
          <span
            className="work__cushion"
            aria-hidden="true"
            title="Production Software Engineering"
          >
            {/* Custom Architectural Brand Emblem in Electric Yellow #FFD000 */}
            <svg
              viewBox="0 0 32 32"
              className="w-[62%] h-[62%] fill-none stroke-[#FFD000] stroke-[2.8] stroke-linecap-round stroke-linejoin-round"
            >
              <polygon points="16 3 29 10.5 29 25.5 16 33 3 25.5 3 10.5 16 3" />
              <polyline points="16 3 16 18 29 10.5" />
              <polyline points="16 18 3 10.5" />
              <polyline points="16 18 16 33" />
            </svg>
          </span>
          <span className="line__word" ref={wordBRef} aria-hidden="true">
            <span className="siglitos-pop-white">work</span>
          </span>
        </h2>
      </div>

      {/* Asymmetric Alternating Poster Track */}
      <ol ref={listRef} className="work__list">
        {projects.map((project, idx) => (
          <li
            key={project.id}
            className="work-card group"
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onClick={() => setSelectedProjectId(project.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProjectId(project.id);
              }
            }}
            aria-label={`${project.title}: Open architectural specification`}
          >
            <div className="work-card__media">
              {project.image ? (
                <div className="w-full relative bg-[#240121] overflow-hidden flex items-center justify-center">
                  <Image
                    src={project.image}
                    alt={`${project.title} interface preview`}
                    width={1600}
                    height={1000}
                    priority={idx === 0}
                    className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              ) : (
                /* Pure Terminal CLI Window for AgenticArmor (No Image) */
                <div className="w-full aspect-[16/10] bg-[#1a0117] text-[#F2EEE5] p-5 sm:p-7 flex flex-col justify-between font-mono select-none border border-white/10">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-[11px] text-white/50 tracking-wider">
                      agenticarmor — devsecops-cli — 80×24
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      CLI GATE
                    </span>
                  </div>

                  {/* Terminal Execution Trace */}
                  <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-[#D1B8CE]">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-[#FFD000] font-bold">➜</span>
                      <span className="text-emerald-400 font-bold">~/repo</span>
                      <span className="text-white font-semibold">$ agenticarmor audit ./src --fail-closed</span>
                    </div>
                    <div className="text-white/60 text-xs pl-4">
                      [INFO] Extracting Babel AST subtrees across 142 source files...
                    </div>
                    <div className="text-white/60 text-xs pl-4">
                      [SAST] Single-node risk scan: 0 critical flags (eval, child_process)
                    </div>
                    <div className="text-white/60 text-xs pl-4">
                      [CIR]  Canonical Intermediate Representation encoded in 1.8ms
                    </div>
                    <div className="text-white/60 text-xs pl-4">
                      [SWARM] LangGraph Sentinel Swarm: 0 prompt injection vectors
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm pl-4 pt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>✔ AUDIT PASSED: Zero vulnerabilities. Exit Code 0 (Safe to merge)</span>
                    </div>
                  </div>

                  {/* Terminal Footer Telemetry */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 mt-3 text-[11px] text-white/40">
                    <div className="flex items-center gap-3">
                      <span>AST: 1.8ms/file</span>
                      <span>•</span>
                      <span>CACHE: 89.4% Hit</span>
                    </div>
                    <span className="text-[#FFD000] font-semibold">EXIT CODE: 0</span>
                  </div>
                </div>
              )}
            </div>

            {/* In-Card Accessible Caption (Visible on Mobile / Fallback) */}
            <div className="md:hidden mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#744470]">
                <span>INDEX // {project.id}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="font-['Hobeaux',cursive,sans-serif] text-2xl text-[#370232]">
                {project.title}
              </h3>
              <p className="text-sm text-[#744470] leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#370232] text-[#FFD000] font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#FFD000] hover:text-[#370232] transition-colors"
                  >
                    <span>Live Site</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
                {project.isTerminal && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#370232]/10 text-[#370232] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#370232]/20">
                    <Terminal className="w-3 h-3 text-[#370232]" />
                    <span>CLI Tool</span>
                  </span>
                )}
                <div className="flex items-center gap-1 text-[#370232] font-mono text-xs font-bold uppercase">
                  <span className="group-hover:text-[#FFD000] transition-colors">View specification</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FFD000]" />
                </div>
              </div>
            </div>

            {/* Mouse-following Floating Cursor Tag in Electric Yellow #FFD000 */}
            <span className="cursor-tag" aria-hidden="true">
              View case
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
                <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
              </svg>
            </span>
          </li>
        ))}
      </ol>

      {/* Pinned Editorial Caption */}
      <div className={`work__caption hidden md:block ${activeProject ? "is-on" : ""}`}>
        {activeProject && (
          <div className="max-w-[94rem] mx-auto grid grid-cols-12 gap-8 items-end">
            {/* Left: Active Project Title & Description */}
            <div className="col-span-8 flex flex-col">
              <div className="flex items-center gap-2 font-mono text-xs text-[#744470] uppercase tracking-wider mb-2 font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFD000]" />
                <span>INDEX // {activeProject.id}</span>
                <span className="text-black/30">•</span>
                <span>{activeProject.category}</span>
              </div>
              <h3 className="font-['Hobeaux',cursive,sans-serif] text-[clamp(2.2rem,3.8vw,4.2rem)] text-[#370232] leading-[0.98] tracking-tight transition-all duration-300">
                {activeProject.title}
              </h3>
              <p className="text-[#744470] text-base leading-relaxed max-w-2xl mt-4 font-sans">
                {activeProject.description}
              </p>
            </div>

            {/* Right: Stack Tags & Open Modal CTA */}
            <div className="col-span-4 flex flex-col items-end gap-5 text-right">
              <div className="font-mono text-xs text-[#744470] tracking-wide font-medium">
                {activeProject.tags}
              </div>

              <div className="flex items-center gap-3">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="pointer-events-auto inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#370232]/20 bg-white/70 text-[#370232] font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-sm transition-all duration-300 hover:bg-[#370232] hover:text-[#FFD000] hover:border-[#370232] hover:shadow-md cursor-pointer"
                  >
                    <span>Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {activeProject.isTerminal && (
                  <span className="pointer-events-none inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-[#370232]/20 bg-[#370232]/5 text-[#370232] font-mono text-xs font-bold tracking-wider uppercase">
                    <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CLI Tool</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(activeProject.id)}
                  className="pointer-events-auto inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#370232] text-[#F2EEE5] font-mono text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 hover:bg-[#FFD000] hover:text-[#370232] hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
                >
                  <span>Open Specification</span>
                  <ExternalLink className="w-4 h-4 text-[#FFD000] group-hover:text-[#370232]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deep-Dive Case Study Specification Modal */}
      <ProjectModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </section>
  );
}
