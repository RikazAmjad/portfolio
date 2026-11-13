import { StrokeDrawType } from "@/components/ui/stroke-draw-type";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#370232] text-[#F2EEE5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,208,0,0.12),transparent_65%)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        <StrokeDrawType
          text="Hello "
          trigger="mount"
          strokeWidth={1.8}
          fontSize={140}
          duration={1.0}
          stagger={0.07}
          delay={0.05}
          color="#F2EEE5"
          fillColor="#FFD000"
          accentColor="#744470"
          autoplay={true}
        />
        <div className="mt-6 flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.28em] text-[#D1B8CE]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FFD000] animate-pulse shadow-[0_0_10px_#FFD000]" />
          <span>Loading Environment</span>
        </div>
      </div>
    </div>
  );
}
