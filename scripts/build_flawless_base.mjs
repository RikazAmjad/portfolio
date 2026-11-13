import { chromium } from 'playwright';
import fs from 'fs';

async function buildFlawlessBase() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p1Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose1.png').toString('base64');
  const p3Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const base64 = await page.evaluate(async ({ p1Data, p3Data }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [p1, p3] = await Promise.all([load(p1Data), load(p3Data)]);
    const W = 960, H = 1440;

    const c1 = document.createElement('canvas');
    c1.width = W; c1.height = H;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(p1, 0, 0);

    const c3 = document.createElement('canvas');
    c3.width = W; c3.height = H;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(p3, 4, -10);

    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');

    // Start with p1 (clean head, neutral face, coffee cup, feet)
    bCtx.drawImage(c1, 0, 0);

    const d1 = ctx1.getImageData(0, 0, W, H).data;
    const d3 = ctx3.getImageData(0, 0, W, H).data;
    const bd = bCtx.getImageData(0, 0, W, H);

    // Anatomical left torso boundary (ONLY below collar y >= 340):
    // Neck collar is at x: 380, y: 340
    // Shoulder crest is at x: 345, y: 375
    // Deltoid socket is at x: 332, y: 440
    // Waist flank is at x: 336, y: 650
    // Hip/pants flank is at x: 325, y: 830
    function getTorsoBoundary(y) {
      if (y < 340) return 0; // DO NOT TOUCH HEAD OR HAIR
      if (y < 375) return 380 - ((y - 340) / 35) * 35; // 380 down to 345
      if (y < 440) return 345 - Math.sin(((y - 375) / 65) * Math.PI) * 13; // 332
      if (y < 650) return 332 + ((y - 440) / 210) * 4; // 336
      if (y < 850) return 336 - ((y - 650) / 200) * 11; // 325
      return 0;
    }

    // 1. Clear moving arm pixels from p1 (y between 340 and 850):
    for (let y = 340; y < 850; y++) {
      const edge = getTorsoBoundary(y);
      for (let x = 0; x < edge; x++) {
        bd.data[(y * W + x) * 4 + 3] = 0;
      }
    }

    // 2. Inpaint the flank, empty pocket, and hip using c3:
    // Notice: in c3, the pocket is EMPTY! So we want 100% of c3's empty pocket!
    // In c3, the empty pocket is bounded by x: 330..415, y: 640..820.
    for (let y = 375; y <= 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      // For the pocket area (y: 640..820, x: edge..410), copy 100% of c3 (empty pocket):
      if (y >= 640 && y <= 820) {
        for (let x = edge; x <= 415; x++) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            bd.data[idx] = d3[idx];
            bd.data[idx+1] = d3[idx+1];
            bd.data[idx+2] = d3[idx+2];
            bd.data[idx+3] = d3[idx+3];
          }
        }
        // Blend edge at x: 410..430 to transition smoothly to p1 center pants:
        for (let x = 415; x <= 435; x++) {
          const idx = (y * W + x) * 4;
          const t = (x - 415) / 20;
          bd.data[idx] = Math.round(d3[idx] * (1 - t) + d1[idx] * t);
          bd.data[idx+1] = Math.round(d3[idx+1] * (1 - t) + d1[idx+1] * t);
          bd.data[idx+2] = Math.round(d3[idx+2] * (1 - t) + d1[idx+2] * t);
        }
      } else {
        // Torso flank (y: 375..640):
        for (let x = edge; x <= edge + 45; x++) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            const t = (x - edge) / 45;
            bd.data[idx] = Math.round(d3[idx] * (1 - t) + d1[idx] * t);
            bd.data[idx+1] = Math.round(d3[idx+1] * (1 - t) + d1[idx+1] * t);
            bd.data[idx+2] = Math.round(d3[idx+2] * (1 - t) + d1[idx+2] * t);
            bd.data[idx+3] = Math.max(d1[idx+3], d3[idx+3]);
          }
        }
      }
    }

    // 3. Smooth the outer anti-aliased edge:
    for (let y = 340; y < 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      if (edge > 0) {
        const idx = (y * W + edge) * 4;
        if (bd.data[idx + 3] > 0) {
          bd.data[idx + 3] = Math.round(bd.data[idx + 3] * 0.7);
        }
      }
    }

    bCtx.putImageData(bd, 0, 0);
    return baseC.toDataURL('image/png');
  }, { p1Data, p3Data });

  const b64 = base64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/character/test_flawless_base.png', Buffer.from(b64, 'base64'));
  console.log('Saved test_flawless_base.png');
  await browser.close();
}

buildFlawlessBase().catch(console.error);
