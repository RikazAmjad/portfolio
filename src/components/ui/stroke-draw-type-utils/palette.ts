export type BjorkTone = "dark" | "light";

// Canvas, WebGL and SVG attribute colours configured to exact user scheme
export const BJORK_PALETTE = {
  dark: {
    bg: "#370232", // Primary dark background: Deep plum
    stage: "#240121",
    surface: "#4A0E44",
    raised: "#744470", // Muted violet
    active: "#8C5787",
    border: "rgba(255,208,0,0.2)",
    borderStrong: "#744470",
    text: "#F2EEE5", // Warm paper
    textMedium: "rgba(242,238,229,0.75)",
    textMuted: "rgba(242,238,229,0.60)",
    textSoft: "rgba(242,238,229,0.50)",
    textFaint: "rgba(242,238,229,0.22)",
    hair: "rgba(242,238,229,0.12)",
    accent: "#FFD000", // Signature accent: Electric yellow
    accentInk: "#FFD000",
    accentFill: "#FFD000",
    accentSoft: "rgba(255,208,0,0.14)",
    accentMuted: "rgba(255,208,0,0.26)",
    accentFg: "#370232",
    success: "#4CC38A",
    warning: "#FFD000",
    error: "#FF6B6B",
  },
  light: {
    bg: "#F2EEE5", // Light backgrounds: Warm paper
    stage: "#F2EEE5",
    surface: "#FFFFFF",
    raised: "#E6E0D3",
    active: "#DDD6C7",
    border: "#D8D0C0",
    borderStrong: "#744470",
    text: "#370232", // Deep plum
    textMedium: "rgba(55,2,50,0.78)",
    textMuted: "rgba(55,2,50,0.68)",
    textSoft: "rgba(55,2,50,0.62)",
    textFaint: "rgba(55,2,50,0.22)",
    hair: "rgba(55,2,50,0.10)",
    accent: "#FFD000", // Signature accent: Electric yellow
    accentInk: "#744470",
    accentFill: "#FFD000",
    accentSoft: "rgba(255,208,0,0.12)",
    accentMuted: "rgba(255,208,0,0.22)",
    accentFg: "#370232",
    success: "#1F8A55",
    warning: "#FFD000",
    error: "#FF6B6B",
  },
} as const;
