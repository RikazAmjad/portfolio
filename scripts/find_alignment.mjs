import { chromium } from 'playwright';
import fs from 'fs';

async function findExactAlignment() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const d1 = 'data:image/jpeg;base64,' + fs.readFileSync('public/one.jpg').toString('base64');
  const d3 = 'data:image/jpeg;base64,' + fs.readFileSync('public/three.jpg').toString('base64');

  const alignment = await page.evaluate(async ({ d1, d3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i3] = await Promise.all([load(d1), load(d3)]);

    // Let's create an offscreen canvas for i1 and i3
    const c1 = document.createElement('canvas');
    c1.width = i1.naturalWidth; c1.height = i1.naturalHeight;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(i1, 0, 0);

    const c3 = document.createElement('canvas');
    c3.width = i3.naturalWidth; c3.height = i3.naturalHeight;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(i3, 0, 0);

    // Let's test alignment by matching the coffee cup lid in i1 to i3.
    // In i1 (609 x 1732), coffee cup lid is around x: 480..560, y: 580..640
    // In i3 (1792 x 2400), coffee cup lid is around x: 1100..1250, y: 600..750
    // Let's find the exact dark rim of the coffee cup lid in i1 and i3:
    // Coffee lid is black plastic (r < 60, g < 60, b < 60), cup sleeve is light cardboard (r > 190, g > 160, b > 130).
    const d1Data = ctx1.getImageData(0, 0, i1.naturalWidth, i1.naturalHeight).data;
    const d3Data = ctx3.getImageData(0, 0, i3.naturalWidth, i3.naturalHeight).data;

    function findCupLid(data, w, h, xMin, xMax, yMin, yMax) {
      let sumX = 0, sumY = 0, count = 0;
      for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          // dark lid rim:
          if (r < 55 && g < 55 && b < 55) {
            sumX += x; sumY += y; count++;
          }
        }
      }
      return count > 0 ? { x: sumX / count, y: sumY / count, count } : null;
    }

    const lid1 = findCupLid(d1Data, i1.naturalWidth, i1.naturalHeight, 460, 560, 580, 640);
    const lid3 = findCupLid(d3Data, i3.naturalWidth, i3.naturalHeight, 1100, 1280, 580, 700);

    // Let's also find the glasses frame center:
    function findGlasses(data, w, h, xMin, xMax, yMin, yMax) {
      // translucent white frames
      let minX = w, maxX = 0, minY = h, maxY = 0;
      for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          if (r > 200 && g > 200 && b > 210) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }
      return { cx: (minX + maxX)/2, cy: (minY + maxY)/2, w: maxX - minX, h: maxY - minY };
    }

    const g1 = findGlasses(d1Data, i1.naturalWidth, i1.naturalHeight, 220, 480, 240, 360);
    const g3 = findGlasses(d3Data, i3.naturalWidth, i3.naturalHeight, 750, 1150, 260, 420);

    return { lid1, lid3, g1, g3 };
  }, { d1, d3 });

  console.log('Landmarks:', alignment);
  await browser.close();
}

findExactAlignment().catch(console.error);
