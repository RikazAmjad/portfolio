# Scroll wave: status
Layers (one 686x1430 canvas, public/character): base, sleeve-up, sleeve-fore, pocket-front, hand + rig.json (pivots).
tools/: matte.py -> build_assets.py (+ prep_hand.py for the hand). Source: panel 1 of the sheet; hand from panel 5.

## Validation actually run (test-harness/, a minimal Next.js 15 app with a pinned 400vh hero; NOT your real hero)
- `next build` (type-check) passed. Chromium (Playwright) against `next start`: DOM transforms of the 3 joints read at 0/15/30/45/60/75/85/100%,
  1%-step sweeps down and up, mid-motion direction reversals, instant 0->100->0 jumps, pause hold, reduced motion, ScrollTrigger count (1).
- Same suite (5% steps) against `next dev` (React StrictMode): still 1 ScrollTrigger. Console: one hydration warning from the harness layout's inline body style.
- Pixel check p0 vs p100: face / coffee hand+cup identical (diff 0.0).
- Visual inspection of live-page screenshots (verification_montage.png) and 3x crops.
Run: cd test-harness; npm i next@15 react@19 react-dom@19 gsap typescript@5 @types/react @types/node; copy ../ScrollWaveCharacter.tsx to components/ and ../public to public/;
npm run build; start the server; python3 test.py http://localhost:3101/ prod

## Known limits
Hoodie behind the arm, hem corner and pants gap are reconstructed (a small stepped notch is visible at the hem corner once the arm has left);
rest hand is the palm view from panel 5; elbow is a rigid 2D joint; tiny reddish speck at the cuff at ~15%.
Not tested: your real repo/hero and its text animation, Safari/Firefox, touch/mobile.

## Integration (Next 16 + motion + Lenis + GSAP)
Two modes, both tested under Lenis with real wheel input (test-harness/test_lenis.py, Next 16.4.3 Turbopack build):
1. `progressSource={scrollYProgress}`: follow the SAME motion `useScroll` value that drives the text illumination (no ScrollTrigger created).
2. `trigger/start/end` + `scrub={true}`: ScrollTrigger mode; requires lenis.on("scroll", ScrollTrigger.update) and gsap.ticker.add(t => lenis.raf(t*1000)).
Size: container width clamp(220px, 15.5vw, 300px) gives a ~525px-tall body at 1905px wide (canvas has left padding for the raised arm).
