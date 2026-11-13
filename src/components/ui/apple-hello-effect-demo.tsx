"use client";

import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";

const AppleHelloEffectDemo = () => {
  return (
    <div className="flex w-full h-screen flex-col justify-center items-center gap-16 bg-[#370232] text-[#FFD000]">
      <AppleHelloEnglishEffect speed={1.1} className="h-28 text-[#FFD000]" />
    </div>
  );
};

export { AppleHelloEffectDemo };

