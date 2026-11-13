import { chromium } from 'playwright';
import fs from 'fs';

async function createPerfectBase() {
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

    // Canvas for p3 (canonical base)
    const c3 = document.createElement('canvas');
    c3.width = W; c3.height = H;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(p3, 0, 0);

    // Canvas for p1 (shifted by dx: -4, dy: 10)
    const c1 = document.createElement('canvas');
    c1.width = W; c1.height = H;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(p1, -4, 10);

    // Output base canvas
    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');

    // 1. Draw p3 as the primary canvas (contains perfect stationary coffee arm, legs, sandals, empty pocket, torso flank)
    bCtx.drawImage(c3, 0, 0);

    // 2. Erase the raised arm from p3 completely:
    // In p3, the raised arm is at x < 350, y between 180 and 520
    const bData = bCtx.getImageData(0, 0, W, H);
    const bd = bData.data;

    // Natural torso contour on viewer's left (shoulder to waist):
    // Collar/neck seam at x: 400, y: 340
    // Shoulder crest at x: 350, y: 375
    // Deltoid outer curve: curves down to underarm at x: 335, y: 440
    // Torso flank: curves from x: 335 at y: 440 down to waist at x: 340, y: 650
    function getLeftTorsoEdge(y) {
      if (y < 340) return 0;
      if (y < 375) return 400 - ((y - 340) / 35) * 50; // 400 down to 350
      if (y < 440) return 350 - Math.sin(((y - 375) / 65) * Math.PI) * 16; // smooth deltoid curve
      if (y < 550) return 335 + ((y - 440) / 110) * 3;
      if (y <= 700) return 338 + ((y - 550) / 150) * 8;
      return 0;
    }

    // Clear everything to the left of the natural torso edge for y < 650:
    for (let y = 0; y < 650; y++) {
      const edge = getLeftTorsoEdge(y);
      for (let x = 0; x < W; x++) {
        if (x < edge) {
          const idx = (y * W + x) * 4;
          bd[idx + 3] = 0;
        }
      }
    }
    bCtx.putImageData(bData, 0, 0);

    // 3. Put the neutral face from c1 onto the head:
    // Neutral mouth and lower face in c1 is at x: 460..510, y: 320..365
    bCtx.drawImage(c1, 445, 315, 80, 55, 445, 315, 80, 55);

    return baseC.toDataURL('image/png');
  }, { p1Data, p3Data });

  const b64 = base64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/character/test_perfect_base.png', Buffer.from(b64, 'base64'));
  console.log('Saved test_perfect_base.png');
  await browser.close();
}

createPerfectBase().catch(console.error);
