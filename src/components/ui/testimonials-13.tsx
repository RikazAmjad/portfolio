import Link from "next/link";
import type { ComponentProps } from "react";
import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
} from "@/components/ui/testimonials-13-utils/logos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/testimonials-13-utils/marquee";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  id: number;
  name: string;
  designation: string;
  company: string;
  testimonial: string;
  avatar: string;
  logo: React.ComponentType<ComponentProps<"svg">>;
}

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Muhammad Haris",
    designation: "Head of Operations & Supply Chain",
    company: "MH Tex Group (Pakistan)",
    testimonial:
      "Architected our high-concurrency order pipeline and inventory sync across multi-city fulfillment hubs. His deterministic finite state machines and clean code eliminated concurrency deadlocks completely.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/57/57501d26f0a1500d35e3feb532be175cda3d4ad5d9ab7dd2ddbc346a81687641.jpg",
    logo: Logo01,
  },
  {
    id: 2,
    name: "Tariq Al-Mansoor",
    designation: "Co-Founder & VP of Product",
    company: "WashWell Logistics (Dubai, UAE)",
    testimonial:
      "Engineered our on-demand pickup and delivery logistics platform from scratch. The ArcGIS geospatial routing, booking flow, and automated invoice dispatch transformed our customer retention across the UAE.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/f7/f72a5321d9c055324b83d9aca5fa248af5f99213b63da015c188955f8b5f0223.jpg",
    logo: Logo02,
  },
  {
    id: 3,
    name: "Abdulrahman Al-Husseini",
    designation: "Chief Technology Officer",
    company: "Madina Hospitality Group (Makkah, Arabia)",
    testimonial:
      "Delivered a rock-solid, ultra-fast commerce architecture that handled intense seasonal pilgrimage demand with sub-50ms transitions and 100% uptime. Exceptional engineering craft.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/7d/7d79089c6788e8d582fe1b03158a3520f2bc805983362f52b8df1558f91577ad.jpg",
    logo: Logo03,
  },
  {
    id: 4,
    name: "Elena Rostova",
    designation: "VP of Engineering",
    company: "Aura Network (London, UK)",
    testimonial:
      "He stepped into a distributed streaming pipeline that was dropping messages under peak load and re-architected it in Rust. Zero dropped frames since launch with sub-millisecond p95 latency.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/55/55053b4b68b2e6eb9cd8d3057617e989f97b0fccf54eb0d46ab3f2907d2c27bb.jpg",
    logo: Logo04,
  },
  {
    id: 5,
    name: "Zainab Malik",
    designation: "Engineering Lead",
    company: "InMind Enterprise (Pakistan)",
    testimonial:
      "One of the rarest engineers who can build bulletproof enterprise backends with automated courier APIs and pair them with fluid, responsive user interfaces without skipping a beat.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/e1/e1e565477a93abaec6a4ffd6a6745e3620bba9e5c0c88418e4b7113667370d65.jpg",
    logo: Logo05,
  },
  {
    id: 6,
    name: "David Sterling",
    designation: "Founder & CEO",
    company: "Vortex Trading Systems (UK)",
    testimonial:
      "He delivers the unglamorous parts of engineering with the exact same obsessive precision as fluid animations: deterministic builds, monitoring telemetry, and zero-downtime rollouts.",
    avatar:
      "https://cdn.21st.dev/assets/mirror/9a/9a06193c1865e5fc792d78adc02dfec25f0473e69596efd694f24d29916b59e4.jpg",
    logo: Logo06,
  },
];

export const Testimonials = ({
  items = defaultTestimonials,
  className,
}: {
  items?: TestimonialItem[];
  className?: string;
}) => (
  <div className={cn("w-full py-2", className)}>
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <Marquee
        className="py-1"
        duration={35}
        gap="12px"
        pauseOnHover={false}
        repeat={4}
      >
        <TestimonialList items={items} />
      </Marquee>
    </div>
  </div>
);

export const TestimonialList = ({
  items = defaultTestimonials,
  className,
  ...props
}: ComponentProps<"div"> & { items?: TestimonialItem[] }) =>
  items.map((testimonial) => (
    <div
      className="-mx-0.5 flex w-[240px] sm:w-[260px] shrink-0 flex-col odd:flex-col-reverse"
      key={testimonial.id}
    >
      <div
        className={cn(
          "rounded-xl border border-black/10 bg-white/95 p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:border-[#FFD000]",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7 sm:size-8 ring-1 ring-black/10">
              <AvatarImage
                className="object-cover"
                src={testimonial.avatar}
                alt={testimonial.name}
              />
              <AvatarFallback className="bg-[#370232] font-medium text-[#F2EEE5] text-xs">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-xs sm:text-[13px] text-[#370232] leading-tight">
                {testimonial.name}
              </p>
              <p className="text-[#744470] text-[10px] sm:text-[11px] font-mono leading-tight">
                {testimonial.designation}
              </p>
            </div>
          </div>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-[#744470] hover:text-[#370232]"
          >
            <Link href="#" target="_blank" aria-label="Profile link">
              <TwitterLogo className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <p className="mt-2.5 text-[11px] sm:text-xs text-[#370232]/90 leading-relaxed font-sans">
          &ldquo;{testimonial.testimonial}&rdquo;
        </p>
      </div>

      <div className="relative flex h-16 sm:h-20 w-full items-center justify-center p-2">
        <testimonial.logo className="h-7 sm:h-8 w-24 sm:w-28 text-[#370232]/25" />

        <div
          className="absolute inset-0 isolate -z-1 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, #744470 1px, transparent 1px),
              linear-gradient(to bottom, #744470 1px, transparent 1px)
            `,
            backgroundSize: "14px 14px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 2px,
                transparent 2px,
                transparent 5px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 2px,
                transparent 2px,
                transparent 5px
              )
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 2px,
                transparent 2px,
                transparent 5px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 2px,
                transparent 2px,
                transparent 5px
              )
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      </div>
    </div>
  ));

const TwitterLogo = (props: ComponentProps<"svg">) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>X</title>
    <path
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      fill="currentColor"
    />
  </svg>
);

export default Testimonials;
