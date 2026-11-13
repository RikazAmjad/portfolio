"use client";

import CursorSkills from "@/components/ui/cursor-skills";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TeamShowcaseDemoPage() {
  return (
    <div className="min-h-screen w-full bg-[#370232] text-[#F2EEE5] flex flex-col justify-between p-6 md:p-12">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs font-bold text-[#F2EEE5] hover:text-[#FFD000] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO PORTFOLIO</span>
        </Link>
        <span className="font-mono text-xs text-[#FFD000] tracking-widest uppercase">
          DEMO // CURSOR-FOLLOWING SKILL SHOWCASE
        </span>
      </div>

      <div className="max-w-6xl mx-auto w-full my-auto py-8">
        <CursorSkills />
      </div>

      <div className="max-w-6xl mx-auto w-full pt-6 border-t border-white/10 font-mono text-xs text-[#D1B8CE] text-center">
        Hover across any of the 4 engineering domains. The preview image appears and smoothly tracks your mouse cursor.
      </div>
    </div>
  );
}
