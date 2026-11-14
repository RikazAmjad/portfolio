import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PreloaderProvider } from "@/components/providers/PreloaderProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Navbar } from "@/components/navigation/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const hobeaux = localFont({
  src: "../../public/fonts/Hobeaux-Bold.woff2",
  variable: "--font-hobeaux",
  weight: "700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rikaz Amjad — Software Engineer",
  description:
    "Original high-performance software engineering portfolio featuring 3D procedural WebGL shaders, scroll choreography, distributed systems architecture, and fluid kinetic design.",
  keywords: [
    "Software Engineer",
    "Creative Development",
    "Three.js",
    "WebGL",
    "Distributed Systems",
    "Next.js App Router",
    "TypeScript",
    "React",
  ],
  authors: [{ name: "Rikaz Amjad" }],
  openGraph: {
    title: "Rikaz Amjad — Software Engineer",
    description: "Bridging distributed systems scalability with precision spatial WebGL interaction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`fluid ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${hobeaux.variable} antialiased selection:bg-[#FFD000] selection:text-[#370232]`}
    >
      <head>
        {/* Preload Critical Display Font for Instant First-Frame Paint */}
        <link
          rel="preload"
          href="/fonts/Hobeaux-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className="relative min-h-screen bg-[#370232] text-[#F2EEE5] overflow-x-hidden font-sans"
      >
        <PreloaderProvider>
          <SmoothScrollProvider>
            {/* Custom Precision Magnetic & Gooey Cursor */}
            <CustomCursor />

            {/* Sticky Adaptive Header - Visible on Frame 1 */}
            <Navbar />

            {/* Main Spatial Narrative Content - Paints Instantly */}
            <main className="relative w-full">{children}</main>
          </SmoothScrollProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
