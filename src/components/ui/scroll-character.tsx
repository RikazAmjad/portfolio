"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScrollCharacterProps {
  triggerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function ScrollCharacter({ className }: ScrollCharacterProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[320px] sm:max-w-[390px] md:max-w-[440px] aspect-[1792/2400] select-none pointer-events-none drop-shadow-2xl",
        className
      )}
      aria-label="3D Developer character holding coffee and waving"
    >
      <Image
        src="/character_transparent.png"
        alt="3D Developer character holding coffee and waving"
        fill
        priority
        sizes="(max-width: 768px) 320px, 440px"
        className="object-contain"
      />
    </div>
  );
}

export default ScrollCharacter;
