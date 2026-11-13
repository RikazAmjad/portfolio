import { chromium } from 'playwright';
import fs from 'fs';

async function inspectPose3Arm() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p3Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const bounds = await page.evaluate(async ({ p3Data }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const p3 = await load(p3Data);
    const c = document.createElement('canvas');
    c.width = 960; c.height = 1440;
    const ctx = c.getContext('2d');
    ctx.drawImage(p3, 0, 0);
    const d = ctx.getImageData(0, 0, 960, 1440).data;

    let minX = 960, maxX = 0, minY = 1440, maxY = 0;
    // Inspect raised arm area: x < 350, y between 150 and 600
    for (let y = 150; y < 600; y++) {
      for (let x = 100; x < 360; x++) {
        const idx = (y * 960 + x) * 4;
        if (d[idx + 3] > 30) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    return { minX, maxX, minY, maxY };
  }, { p3Data });

  console.log('Pose 3 arm bounds in 960x1440:', bounds);
  await browser.close();
}

inspectPose3Arm().catch(console.error);
