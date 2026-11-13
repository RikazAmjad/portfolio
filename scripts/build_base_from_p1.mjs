import { chromium } from 'playwright';
import fs from 'fs';

async function buildBaseFromP1() {
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

    // Canvas for p1 (Canonical base for head, neutral face, coffee cup, feet)
    const c1 = document.createElement('canvas');
    c1.width = W; c1.height = H;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(p1, 0, 0);

    // Canvas for p3 aligned to p1 (dx: 4, dy: -10)
    // In p3, the arm is raised, so the flank, empty pocket, and hip are clean!
    const c3 = document.createElement('canvas');
    c3.width = W; c3.height = H;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(p3, 4, -10);

    // Erase raised arm from c3 so nothing at x < 350, y < 440 pollutes:
    const c3Data = ctx3.getImageData(0, 0, W, H);
    for (let y = 0; y < 440; y++) {
      for (let x = 0; x < 370; x++) {
        c3Data.data[(y * W + x) * 4 + 3] = 0;
      }
    }
    ctx3.putImageData(c3Data, 0, 0);

    // Now composite onto base canvas:
    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');

    // Start with p1
    bCtx.drawImage(c1, 0, 0);

    // Now inpaint the region where the arm was in p1:
    // In p1, the arm covers x: 230..370, y: 440..820 (torso flank, empty pocket, hip)
    // In c3, that exact region has the clean empty pocket and clean hip!
    // Let's replace the arm area in p1 with the clean flank and empty pocket from c3:
    const d1 = ctx1.getImageData(0, 0, W, H).data;
    const d3 = ctx3.getImageData(0, 0, W, H).data;
    const bd = bCtx.getImageData(0, 0, W, H);

    for (let y = 430; y <= 830; y++) {
      for (let x = 200; x <= 410; x++) {
        const idx = (y * W + x) * 4;
        // In c3, the body flank ends around x = 330..340, and the pocket extends to x = 390
        // If c3 has valid body pixels, copy them to replace the arm of p1!
        if (d3[idx + 3] > 30) {
          bd.data[idx] = d3[idx];
          bd.data[idx+1] = d3[idx+1];
          bd.data[idx+2] = d3[idx+2];
          bd.data[idx+3] = d3[idx+3];
        } else {
          // If c3 has background/transparency here, this was the outer sleeve of p1!
          // We must clear it to transparent!
          bd.data[idx+3] = 0;
        }
      }
    }

    // Now for shoulder area (y: 360..430):
    // Smooth the shoulder socket on the left:
    // Shoulder curve in p1 runs from x: 345 at y: 370 down to x: 335 at y: 430
    for (let y = 350; y < 430; y++) {
      const outerX = 345 - ((y - 350) / 80) * 12;
      for (let x = 0; x < outerX; x++) {
        bd.data[(y * W + x) * 4 + 3] = 0;
      }
    }

    bCtx.putImageData(bd, 0, 0);
    return baseC.toDataURL('image/png');
  }, { p1Data, p3Data });

  const b64 = base64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/character/test_base_from_p1.png', Buffer.from(b64, 'base64'));
  console.log('Saved test_base_from_p1.png');
  await browser.close();
}

buildBaseFromP1().catch(console.error);
