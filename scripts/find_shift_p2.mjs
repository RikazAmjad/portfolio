import { chromium } from 'playwright';
import fs from 'fs';

async function findShiftP2() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p2 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose2.png').toString('base64');
  const p3 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const shift = await page.evaluate(async ({ p2, p3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i2, i3] = await Promise.all([load(p2), load(p3)]);

    const c2 = document.createElement('canvas');
    c2.width = 960; c2.height = 1440;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(i2, 0, 0);

    const c3 = document.createElement('canvas');
    c3.width = 960; c3.height = 1440;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(i3, 0, 0);

    const tw = 60, th = 120;
    const tx = 600, ty = 520;
    const t3 = ctx3.getImageData(tx, ty, tw, th).data;

    let bestDiff = Infinity;
    let bestShift = { dx: 0, dy: 0 };

    for (let dy = -20; dy <= 20; dy++) {
      for (let dx = -20; dx <= 20; dx++) {
        const d2 = ctx2.getImageData(tx + dx, ty + dy, tw, th).data;
        let diff = 0;
        let count = 0;
        for (let i = 0; i < tw * th * 4; i += 4) {
          if (t3[i+3] > 100 && d2[i+3] > 100) {
            diff += Math.abs(t3[i] - d2[i]) + Math.abs(t3[i+1] - d2[i+1]) + Math.abs(t3[i+2] - d2[i+2]);
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
  }, { p2, p3 });

  console.log('Best shift of p2 relative to p3:', shift);
  await browser.close();
}

findShiftP2().catch(console.error);
