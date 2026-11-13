import StrokeDrawTypeDemo from "@/components/ui/demo";

export const metadata = {
  title: "StrokeDrawType Demo | UI Component",
  description: "Interactive demo preview of StrokeDrawType component.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 flex flex-col items-center justify-center bg-[#370232] text-[#F2EEE5]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-xs uppercase font-mono tracking-[0.25em] text-[#FFD000] mb-2">
            Component Verification
          </p>
          <h1 className="text-2xl md:text-3xl font-mono font-semibold text-[#F2EEE5]">
            Stroke Draw Type Demo
          </h1>
          <p className="text-sm text-[#D1B8CE] mt-2 max-w-md">
            Outline pen draw animation that fills with liquid goo effect. Hover over letters to drain.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-[#FFD000]/20 bg-[#4A0E44] p-8 shadow-2xl">
          <StrokeDrawTypeDemo />
        </div>
      </div>
    </div>
  );
}
