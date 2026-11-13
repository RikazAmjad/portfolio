import { chromium } from 'playwright';
import fs from 'fs';

async function findExactShift() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p1 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose1.png').toString('base64');
  const p3 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const shift = await page.evaluate(async ({ p1, p3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i3] = await Promise.all([load(p1), load(p3)]);

    const c1 = document.createElement('canvas');
    c1.width = 960; c1.height = 1440;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(i1, 0, 0);

    const c3 = document.createElement('canvas');
    c3.width = 960; c3.height = 1440;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(i3, 0, 0);

    // Test shifts of p1 relative to p3 around coffee cup:
    // Coffee cup template in p3: x: 590..660, y: 510..670
    const tw = 60, th = 120;
    const tx = 600, ty = 520;
    const t3 = ctx3.getImageData(tx, ty, tw, th).data;

    let bestDiff = Infinity;
    let bestShift = { dx: 0, dy: 0 };

    for (let dy = -20; dy <= 20; dy++) {
      for (let dx = -20; dx <= 20; dx++) {
        const d1 = ctx1.getImageData(tx + dx, ty + dy, tw, th).data;
        let diff = 0;
        let count = 0;
        for (let i = 0; i < tw * th * 4; i += 4) {
          if (t3[i+3] > 100 && d1[i+3] > 100) {
            diff += Math.abs(t3[i] - d1[i]) + Math.abs(t3[i+1] - d1[i+1]) + Math.abs(t3[i+2] - d1[i+2]);
            count++;
          }
        }
        const avg = count > 0 ? diff / (count * 3) : Infinity;
        if (avg < bestDiff) {
          bestDiff = avg;
          bestShift = { dx, dy, avg };
        }
      }
    }
    return bestShift;
  }, { p1, p3 });

  console.log('Best shift of p1 relative to p3:', shift);
  await browser.close();
}

findExactShift().catch(console.error);
