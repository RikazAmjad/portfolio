// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the
   context is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
  Ongoing: 13,
  Present: 14,
  "All Year": 15,
} as const;

export type Month = keyof typeof monthOrder;

export type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  role?: string;
  company?: string;
  content: string;
};

type SplitTextInstance = InstanceType<typeof SplitText>;

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
  topItems?: JourneyItem[];
  bottomItems?: JourneyItem[];
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

export const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "2024-april",
    year: "2024",
    month: "April",
    role: "Full-stack Developer Intern",
    company: "Websquads Services",
    content: "Learned about full-stack CRUD applications, responsive interfaces, and integrated distributed database architectures.",
  },
  {
    id: "2025-february",
    year: "2025",
    month: "February",
    role: "Software Engineer Intern",
    company: "MilestoneZero",
    content: "Architected modern modular client applications, performance-optimized render lifecycles, and component systems with Next.js and React.js.",
  },
  {
    id: "2026-freelance",
    year: "2026",
    month: "All Year",
    role: "Freelance Software Engineer",
    company: "Independent Client Solutions",
    content: "Delivered bespoke full-stack applications, high-performance Next.js client platforms, and scalable backend services for international clients throughout 2026.",
  },
];

export const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "2024-july",
    year: "2024",
    month: "July",
    role: "Frontend Developer Intern",
    company: "Snow Dream Studios GmbH",
    content: "Crafted high-performance responsive interfaces, interactive design systems, and animations with React.js and Tailwind CSS.",
  },
  {
    id: "2025-may",
    year: "2025",
    month: "May",
    role: "Software Engineer",
    company: "MilestoneZero (Present)",
    content: "Promoted to full-time Software Engineer; architecting production web platforms, distributed state, and enterprise systems.",
  },
];

export default function Timeline({
  title = "Product Storyline",
  periodLabel = "2024 — 2026",
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  activeColor = "#ff5f00",
  backgroundColor = "var(--color-background, #ffffff)",
  imageUrl = "https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg",
  imageAlt = "Modern office workspace",
  duration,
  scrollDuration = 1.2,
  topItems = defaultTopJourneyData,
  bottomItems = defaultBottomJourneyData,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  const allJourneyItems: JourneyItem[] = [
    ...topItems,
    ...bottomItems,
  ].sort((a, b) => {
    const yearDiff = Number(a.year) - Number(b.year);
    if (yearDiff !== 0) return yearDiff;
    return monthOrder[a.month] - monthOrder[b.month];
  });

  // Connect Lenis smooth scroll updates with GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === "undefined") return;
    const globalLenis = (window as unknown as { __lenis?: { on: (event: string, cb: () => void) => void } }).__lenis;
    if (globalLenis) {
      globalLenis.on("scroll", ScrollTrigger.update);
    }
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackContainerRef.current;
    const wholeSlider = wholeSliderRef.current;

    if (!section || !track || !wholeSlider) return;

    const isMobile = window.innerWidth < 600;
    const slidePercent = isMobile ? -60 : -66;
    const maxLineWidth = isMobile ? 68 : 96;
    const totalDuration = 10;

    // Set initial zeroed state: vertical line, dot, and text must be hidden initially
    allJourneyItems.forEach((item) => {
      const isTop = topItems.some((t) => t.id === item.id);
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: isTop ? "bottom center" : "top center",
      });
      gsap.set(`.jd-${item.id}`, { scale: 0 });
      gsap.set(`.title-${item.id}`, { opacity: 0, y: isTop ? -10 : 10 });
      gsap.set(`.description-${item.id}`, { opacity: 0, y: isTop ? -8 : 8 });
    });

    if (reducedMotion) {
      gsap.set(".journey-line", { width: `${maxLineWidth}%` });
      allJourneyItems.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1 });
        gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 });
        gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 });
      });
      return;
    }

    // Unified Master Timeline driven by ScrollTrigger
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });

    // 1. Horizontal track translation
    masterTl.fromTo(
      wholeSlider,
      { xPercent: 0 },
      { xPercent: slidePercent, ease: "none", duration: totalDuration },
      0
    );

    // 2. Continuous horizontal line growth from 0% to maxLineWidth%
    masterTl.fromTo(
      ".journey-line",
      { width: "0%" },
      { width: `${maxLineWidth}%`, ease: "none", duration: totalDuration },
      0
    );

    // 3. Coordinate vertical lines strictly to the horizontal line arrival at each milestone's vertex
    const containerRect = track.getBoundingClientRect();
    const totalTrackWidth = track.offsetWidth || 1;

    allJourneyItems.forEach((item) => {
      const lineEl = section.querySelector(`.jl-${item.id}`) as HTMLElement;
      if (!lineEl) return;

      const offset = lineEl.getBoundingClientRect().left - containerRect.left;
      const pctOnTrack = (offset / totalTrackWidth) * 100;

      // Exact arrival timestamp in masterTl when the horizontal line tip touches this milestone's vertex
      const arrivalTime = Math.max(0.2, Math.min((pctOnTrack / maxLineWidth) * totalDuration, 9.6));
      const stemDuration = 0.45; // duration of vertical line shoot
      const isTop = topItems.some((t) => t.id === item.id);

      // ONLY when the horizontal line tip reaches this vertex, the vertical stem shoots out!
      masterTl.fromTo(
        `.jl-${item.id}`,
        { scaleY: 0 },
        { scaleY: 1, duration: stemDuration, ease: "power2.out" },
        arrivalTime
      );

      // Dot emerges at the tip of the vertical stem
      masterTl.fromTo(
        `.jd-${item.id}`,
        { scale: 0 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
        arrivalTime + stemDuration * 0.45
      );

      // Title & description reveal smoothly
      masterTl.fromTo(
        `.title-${item.id}`,
        { opacity: 0, y: isTop ? -10 : 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        arrivalTime + stemDuration * 0.55
      );

      masterTl.fromTo(
        `.description-${item.id}`,
        { opacity: 0, y: isTop ? -8 : 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        arrivalTime + stemDuration * 0.7
      );
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [reducedMotion], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="h-[110vw] sm:h-[120vw] max-[600px]:h-[220vh] w-full relative overflow-visible"
      style={sectionStyle}
    >
      <div className="h-screen w-full sticky top-[0%] pt-[3%] overflow-hidden max-[600px]:top-[5%]">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[30vw] w-[240vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[80vh] max-[600px]:w-[800vw] max-[600px]:px-[7vw] will-change-transform transform-gpu"
        >
          <div className="h-full w-[30vw] overflow-hidden rounded-[1.4vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw] border border-white/10 shadow-2xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>

          <div ref={trackContainerRef} className="relative h-full w-full">
            <div className="w-full absolute left-0 top-[49%] -translate-y-1/2 flex items-center h-fit">
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
              <div
                className="h-px w-[0%] rounded-full journey-line"
                style={activeStyle}
              ></div>
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="w-[65%] text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw] font-['Hobeaux',cursive,sans-serif] font-bold">
                  {title}
                </h2>
              </div>

              <div className="w-full flex h-full gap-x-[36vw] max-[600px]:gap-x-[40vw]">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[28vw] px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full pointer-events-none">
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] -translate-x-1/2 relative aspect-square rounded-full jd-${item.id}`}
                        style={{ ...activeStyle, transform: "scale(0)" }}
                      ></div>
                      <div
                        className={`h-[94%] w-px origin-bottom rounded-full jl-${item.id}`}
                        style={{ ...activeStyle, transform: "scaleY(0)" }}
                      ></div>
                    </div>

                    <div className="mt-[-1vw] space-y-[0.5vw] max-[600px]:mt-[-2vw]">
                      <h4
                        className={`title-${item.id} text-[2.2vw] leading-none max-[600px]:text-[6.4vw] font-['Hobeaux',cursive,sans-serif] font-bold`}
                        style={{ opacity: 0 }}
                      >
                        {item.year} {item.month}
                      </h4>
                      {item.company && (
                        <div
                          className={`title-${item.id} flex flex-col gap-0.5`}
                          style={{ opacity: 0 }}
                        >
                          <span className="text-[1.15vw] max-[600px]:text-[3.8vw] font-bold text-[#F2EEE5] leading-tight font-sans">
                            {item.role}
                          </span>
                          <span className="text-[0.85vw] max-[600px]:text-[2.8vw] font-mono uppercase tracking-wider text-[#FFD000] font-semibold">
                            {item.company}
                          </span>
                        </div>
                      )}
                      <p
                        className={`description-${item.id} w-[92%] text-[1.1vw] leading-[1.3] max-[600px]:w-[90%] max-[600px]:text-[3.6vw] font-sans`}
                        style={{ ...mutedTextStyle, opacity: 0 }}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1/2 flex items-center justify-start w-full">
              <div className="w-[34%] pt-[2vw] max-[600px]:pt-[5vw] max-[600px]:w-[30%] h-full">
                <p
                  className="text-[1.65vw] leading-none max-[600px]:text-[4.2vw] font-mono tracking-widest uppercase font-semibold"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              <div className="w-full flex h-full gap-x-[34vw] ml-[7vw] max-[600px]:gap-x-[40vw] max-[600px]:ml-[7vw]">
                {bottomItems.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[28vw] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-[-1%] h-full pointer-events-none">
                      <div
                        className={`h-[94%] origin-top w-px rounded-full max-[600px]:h-full jl-${item.id}`}
                        style={{ ...activeStyle, transform: "scaleY(0)" }}
                      ></div>
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] -translate-x-1/2 relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={{ ...activeStyle, transform: "scale(0)" }}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[0.5vw]">
                      <h4
                        className={`title-${item.id} text-[2.2vw] leading-none max-[600px]:text-[6.4vw] font-['Hobeaux',cursive,sans-serif] font-bold`}
                        style={{ opacity: 0 }}
                      >
                        {item.year} {item.month}
                      </h4>
                      {item.company && (
                        <div
                          className={`title-${item.id} flex flex-col gap-0.5`}
                          style={{ opacity: 0 }}
                        >
                          <span className="text-[1.15vw] max-[600px]:text-[3.8vw] font-bold text-[#F2EEE5] leading-tight font-sans">
                            {item.role}
                          </span>
                          <span className="text-[0.85vw] max-[600px]:text-[2.8vw] font-mono uppercase tracking-wider text-[#FFD000] font-semibold">
                            {item.company}
                          </span>
                        </div>
                      )}
                      <p
                        className={`description-${item.id} w-[92%] text-[1.1vw] leading-[1.3] max-[600px]:w-[90%] max-[600px]:text-[3.6vw] font-sans`}
                        style={{ ...mutedTextStyle, opacity: 0 }}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

