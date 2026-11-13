"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layers (all same pixel size except hand, positioned in one 1:1 coordinate space):
 *  base.png       character WITHOUT the pocket arm (needs inpainting; see README)
 *  sleeve-up.png  upper-arm sleeve   (pivot = shoulder)
 *  sleeve-fore.png forearm sleeve + cuff (pivot = elbow)
 *  hand.png       provided, cut from panel 5 (pivot = wrist)
 * All layers share one 686x1430 canvas; pivots below are measured from public/character/rig.json.
 *  pocket-front.png  real pants pixels below the pocket lip, drawn on top so the hand starts inside the pocket
 */
const RIG = {
  upper: { origin: "51.3% 40.0%" },            // shoulder
  fore: { origin: "46.4% 51.4%" },             // elbow
  hand: { origin: "50% 96%", left: "46.3%", top: "49.8%", width: "14.7%" }, // wrist at cuff
};
const REST = { upper: 0, fore: 0, hand: 159 };   // hanging arm, fingers down into the pocket

/** Anything with get()/on("change"), e.g. motion's scrollYProgress MotionValue (0..1). */
export type ProgressSource = { get(): number; on(event: "change", cb: (v: number) => void): () => void };

type Props = {
  trigger?: string;
  basePath?: string;
  aspect?: string;
  start?: string;
  end?: string;
  /** If given, the timeline follows this 0..1 value (no ScrollTrigger is created). */
  progressSource?: ProgressSource;
  /** ScrollTrigger mode only. Use `true` (no extra smoothing) when Lenis already smooths the scroll. */
  scrub?: number | boolean;
  className?: string;
};

const LAYER: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  userSelect: "none",
  pointerEvents: "none",
};

export default function ScrollWaveCharacter({
  trigger,
  basePath = "/character",
  aspect = "686 / 1430",
  start = "top 70%",
  end = "bottom top",
  progressSource,
  scrub = 0.6,
  className,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Time axis is 0..100 so positions read as the percentages in the brief.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        ...(progressSource
          ? { paused: true }
          : {
              scrollTrigger: {
                trigger: trigger ? document.querySelector(trigger)! : el,
                start,
                end,
                scrub,          // smoothing only; position is a pure function of scroll
                invalidateOnRefresh: true,
              },
            }),
      });
      gsap.set(q(".hand"), { rotation: REST.hand });
      // 0-30 pocket exit: arm swings out, forearm folds across the body, hand slides out of the pocket
      tl.to(q(".upper"), { rotation: 30, duration: 30, ease: "power1.inOut" }, 0)
        .to(q(".fore"), { rotation: -90, duration: 30, ease: "power1.inOut" }, 0)
        // 30-55 lift: upper arm out, forearm up, hand turns upright
        .to(q(".upper"), { rotation: 62, duration: 25, ease: "power2.inOut" }, 30)
        .to(q(".fore"), { rotation: -211, duration: 25, ease: "power2.inOut" }, 30)
        .to(q(".hand"), { rotation: 149, duration: 55, ease: "power1.inOut" }, 0)
        // 55-85 exactly one wave: wrist only, upper arm held
        .to(q(".hand"), { rotation: 129, duration: 10, ease: "sine.inOut" }, 55)
        .to(q(".hand"), { rotation: 169, duration: 10, ease: "sine.inOut" }, 65)
        .to(q(".hand"), { rotation: 149, duration: 10, ease: "sine.inOut" }, 75)
        // 85-100 hold
        .to({}, { duration: 15 }, 85);
      let off: (() => void) | undefined;
      if (progressSource) {      // controlled mode: the timeline position IS the supplied progress value
        const apply = (v: number) => tl.progress(Math.min(1, Math.max(0, v)));
        apply(progressSource.get());
        off = progressSource.on("change", apply);
      }
      return () => {
        off?.();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
    // reduced motion: static raised pose, no scrubbing
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q(".upper"), { rotation: 62 });
      gsap.set(q(".fore"), { rotation: -211 });
      gsap.set(q(".hand"), { rotation: 149 });
    });
    return () => mm.revert();   // kills timelines + ScrollTriggers on unmount / StrictMode remount
  }, [trigger, start, end, progressSource, scrub]);

  return (
    <div
      ref={root}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable @next/next/no-img-element */}
      {/* stationary: body, face, coffee hand + cup */}
      <img src={`${basePath}/base.png`} alt="" style={LAYER} draggable={false} />
      {/* arm chain: shoulder -> elbow -> wrist, nested so each joint inherits its parent's rotation */}
      <div className="upper" style={{ ...LAYER, transformOrigin: RIG.upper.origin }}>
        <img src={`${basePath}/sleeve-up.png`} alt="" style={LAYER} draggable={false} />
        <div className="fore" style={{ ...LAYER, transformOrigin: RIG.fore.origin }}>
          <img
            src={`${basePath}/hand.png`}
            alt=""
            className="hand"
            style={{
              position: "absolute",
              ...RIG.hand,
              height: "auto",
              transformOrigin: RIG.hand.origin,
              userSelect: "none",
            }}
            draggable={false}
          />
          <img src={`${basePath}/sleeve-fore.png`} alt="" style={LAYER} draggable={false} />
        </div>
      </div>
      <img src={`${basePath}/pocket-front.png`} alt="" style={LAYER} draggable={false} />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

