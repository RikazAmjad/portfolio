import { chromium } from 'playwright';
import fs from 'fs';

async function locateSleeve() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const d1 = 'data:image/jpeg;base64,' + fs.readFileSync('public/one.jpg').toString('base64');
  const d3 = 'data:image/jpeg;base64,' + fs.readFileSync('public/three.jpg').toString('base64');

  const loc = await page.evaluate(async ({ d1, d3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i3] = await Promise.all([load(d1), load(d3)]);

    function findCardboard(img) {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;

      let minX = c.width, maxX = 0, minY = c.height, maxY = 0, count = 0;
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const idx = (y * c.width + x) * 4;
          const r = d[idx], g = d[idx+1], b = d[idx+2];
          // cardboard sleeve RGB ~ (198, 172, 142)
          if (r > 175 && r < 215 && g > 150 && g < 185 && b > 120 && b < 155 && r > g && g > b) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            count++;
          }
        }
      }
      return { minX, maxX, minY, maxY, count, cx: (minX+maxX)/2, cy: (minY+maxY)/2, w: maxX-minX, h: maxY-minY };
    }

    return {
      sleeve1: findCardboard(i1),
      sleeve3: findCardboard(i3),
    };
  }, { d1, d3 });

  console.log(loc);
  await browser.close();
}

locateSleeve().catch(console.error);
