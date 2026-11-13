import { chromium } from 'playwright';
import fs from 'fs';

async function buildSeamlessBase() {
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
    // Align p3 to p1 (dx: 4, dy: -10)
    ctx3.drawImage(p3, 4, -10);

    // Output base canvas
    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');

    // Start with p1
    bCtx.drawImage(c1, 0, 0);

    const d1 = ctx1.getImageData(0, 0, W, H).data;
    const d3 = ctx3.getImageData(0, 0, W, H).data;
    const bd = bCtx.getImageData(0, 0, W, H);

    // Anatomical left torso boundary (shoulder crest to hip):
    function getTorsoBoundary(y) {
      if (y < 340) return 400;
      if (y < 375) return 400 - ((y - 340) / 35) * 55; // slopes to 345
      if (y < 440) return 345 - Math.sin(((y - 375) / 65) * Math.PI) * 12; // round deltoid to 333
      if (y < 550) return 333 + ((y - 440) / 110) * 3; // 336
      if (y < 670) return 336 + ((y - 550) / 120) * 4; // 340
      if (y < 850) return 340 - ((y - 670) / 180) * 15; // 325 (hip to leg)
      return 320;
    }

    // 1. Clear all pixels to the left of the torso boundary for all y:
    for (let y = 0; y < 850; y++) {
      const edge = getTorsoBoundary(y);
      for (let x = 0; x < edge; x++) {
        bd.data[(y * W + x) * 4 + 3] = 0;
      }
    }

    // 2. In the body flank, empty pocket, and hip region (y: 375..850):
    // Smoothly blend clean flank from c3 into c1 across x: edge..edge+60
    for (let y = 375; y <= 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      const blendW = 60;
      for (let x = edge; x < edge + blendW; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          const t = (x - edge) / blendW; // 0 at edge (100% c3), 1 at inner (100% c1)
          // Smoothstep
          const f = t * t * (3 - 2 * t);
          bd.data[idx] = Math.round(d3[idx] * (1 - f) + d1[idx] * f);
          bd.data[idx+1] = Math.round(d3[idx+1] * (1 - f) + d1[idx+1] * f);
          bd.data[idx+2] = Math.round(d3[idx+2] * (1 - f) + d1[idx+2] * f);
          bd.data[idx+3] = Math.round(d3[idx+3] * (1 - f) + d1[idx+3] * f);
        }
      }
    }

    // 3. Smooth the outer anti-aliased edge along the torso boundary:
    for (let y = 340; y < 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      const idx = (y * W + edge) * 4;
      if (bd.data[idx + 3] > 0) {
        bd.data[idx + 3] = Math.round(bd.data[idx + 3] * 0.75);
      }
    }

    bCtx.putImageData(bd, 0, 0);
    return baseC.toDataURL('image/png');
  }, { p1Data, p3Data });

  const b64 = base64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/character/test_seamless_base.png', Buffer.from(b64, 'base64'));
  console.log('Saved test_seamless_base.png');
  await browser.close();
}

buildSeamlessBase().catch(console.error);
