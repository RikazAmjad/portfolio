import type { ComponentProps } from "react";

export function Logo01(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <path d="M12 10h12v4H12zM12 18h18v4H12zM12 26h14v4H12z" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">TECHCORP</text>
    </svg>
  );
}

export function Logo02(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <circle cx="18" cy="20" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M14 20h8M18 16v8" stroke="currentColor" strokeWidth="2" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">INSIGHT</text>
    </svg>
  );
}

export function Logo03(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <polygon points="10,30 20,10 30,30" stroke="currentColor" strokeWidth="3" fill="none" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">DESIGNPRO</text>
    </svg>
  );
}

export function Logo04(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <rect x="10" y="10" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="19" cy="19" r="4" fill="currentColor" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">BRANDBOOST</text>
    </svg>
  );
}

export function Logo05(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <path d="M10 20L18 10L26 20L18 30Z" stroke="currentColor" strokeWidth="3" fill="none" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">CRAFTERS</text>
    </svg>
  );
}

export function Logo06(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" {...props}>
      <path d="M12 12L24 24M24 12L12 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <text x="36" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold">INNOVATEX</text>
    </svg>
  );
}

