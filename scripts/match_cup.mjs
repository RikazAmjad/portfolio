import { chromium } from 'playwright';
import fs from 'fs';

async function matchCup() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const d1 = 'data:image/jpeg;base64,' + fs.readFileSync('public/one.jpg').toString('base64');
  const d3 = 'data:image/jpeg;base64,' + fs.readFileSync('public/three.jpg').toString('base64');

  const match = await page.evaluate(async ({ d1, d3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i3] = await Promise.all([load(d1), load(d3)]);

    const c1 = document.createElement('canvas');
    c1.width = i1.naturalWidth; c1.height = i1.naturalHeight;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(i1, 0, 0);

    const c3 = document.createElement('canvas');
    c3.width = i3.naturalWidth; c3.height = i3.naturalHeight;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(i3, 0, 0);

    // Cup sleeve template from i1:
    const tw = 60, th = 60;
    const tx = 470, ty = 635;
    const tData = ctx1.getImageData(tx, ty, tw, th).data;

    let bestScore = -Infinity;
    let best = null;

    // Search around i3 x: 1100..1280, y: 700..900, scale: 1.30 to 1.45
    for (let s = 1.34; s <= 1.42; s += 0.01) {
      const sw = Math.round(tw * s);
      const sh = Math.round(th * s);

      // Scaled template
      const sc = document.createElement('canvas');
      sc.width = sw; sc.height = sh;
      const sctx = sc.getContext('2d');
      sctx.drawImage(c1, tx, ty, tw, th, 0, 0, sw, sh);
      const sData = sctx.getImageData(0, 0, sw, sh).data;

      for (let y = 780; y <= 860; y += 2) {
        for (let x = 1140; x <= 1240; x += 2) {
          const c3Data = ctx3.getImageData(x, y, sw, sh).data;
          let diff = 0;
          for (let i = 0; i < sw * sh * 4; i += 4) {
            diff += Math.abs(sData[i] - c3Data[i]) + Math.abs(sData[i+1] - c3Data[i+1]) + Math.abs(sData[i+2] - c3Data[i+2]);
          }
          const score = -diff;
          if (score > bestScore) {
            bestScore = score;
            best = { s, x, y, tx, ty, diff: diff / (sw * sh) };
          }
        }
      }
    }
    return best;
  }, { d1, d3 });

  console.log('Best match:', match);
  await browser.close();
}

matchCup().catch(console.error);
