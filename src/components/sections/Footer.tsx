"use client";

import * as React from "react";
import PushpinTearFooter from "@/components/ui/pushpin-tear-footer";

export function Footer() {
  return (
    <footer id="footer" className="relative w-full overflow-hidden bg-[#370232] z-20">
      <PushpinTearFooter
        brand="rikaz"
        name="rikaz amjad"
        logo={
          <span className="font-['Hobeaux',cursive,sans-serif] text-2xl font-bold tracking-tight text-[#FFD000] select-none hover:opacity-90 transition-opacity">
            Rikaz Amjad
          </span>
        }
        logoHref="#hero"
        sheet="#370232"
        paper="#F2EEE5"
        sheetInk="#F2EEE5"
        paperInk="#370232"
        pinColor="#FFD000"
        fontSans="var(--font-geist-sans), system-ui, -apple-system, sans-serif"
        email="rikazamjad@gmail.com"
        newsletter={{
          label: "Let me know what you think and let's build it",
          placeholder: "your@email.com",
        }}
        status={{
          label: "open for the system you want",
          href: "mailto:rikazamjad@gmail.com",
        }}
        mark=""
        timeZone="Asia/Karachi"
        timeLabel="PKT"
        socials={[
          { icon: "github", label: "GitHub", href: "https://github.com" },
          { icon: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
          { icon: "x", label: "X / Twitter", href: "https://x.com" },
        ]}
        columns={[
          {
            title: "Navigate",
            links: [
              { label: "01 // Architecture", href: "#architecture" },
              { label: "02 // Selected Works", href: "#works" },
              { label: "03 // Engineering Matrix", href: "#matrix" },
              { label: "04 // Field Notes", href: "#notes" },
              { label: "05 // Dispatch", href: "#contact" },
            ],
            cta: { label: "dispatch.", href: "#contact" },
          },
          {
            title: "Connect",
            links: [
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "X / Twitter", href: "https://x.com" },
              { label: "Terminal Console", href: "#contact" },
            ],
            cta: { label: "email.", href: "mailto:rikazamjad@gmail.com" },
          },
        ]}
        sideLinks={[
          { icon: "globe", label: "rikazamjad.com", href: "https://rikazamjad.com" },
          { icon: "doc", label: "Get CV", href: "https://collection.cloudinary.com/drv7bdv3u/ea464e18e9a39382a0689e4b31b79623" },
        ]}
        chat={{ label: "let's talk", href: "mailto:rikazamjad@gmail.com" }}
        copyright="© 2026 Rikaz Amjad"
        // credit="crafted with precision & physics"
        handle={{ label: "rikazamjad@gmail.com", href: "mailto:rikazamjad@gmail.com" }}
      />
    </footer>
  );
}

export default Footer;
