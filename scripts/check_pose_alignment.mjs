import { chromium } from 'playwright';
import fs from 'fs';

async function checkPoseAlignment() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p1 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose1.png').toString('base64');
  const p3 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const diff = await page.evaluate(async ({ p1, p3 }) => {
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

    const d1 = ctx1.getImageData(0, 0, 960, 1440).data;
    const d3 = ctx3.getImageData(0, 0, 960, 1440).data;

    // Compare coffee cup in p1 and p3 (x: 580..670, y: 500..680)
    let cupDiff = 0, cupPixels = 0;
    for (let y = 500; y <= 680; y++) {
      for (let x = 580; x <= 670; x++) {
        const idx = (y * 960 + x) * 4;
        if (d1[idx+3] > 100 && d3[idx+3] > 100) {
          cupDiff += Math.abs(d1[idx] - d3[idx]) + Math.abs(d1[idx+1] - d3[idx+1]) + Math.abs(d1[idx+2] - d3[idx+2]);
          cupPixels++;
        }
      }
    }

    // Compare sandals/feet in p1 and p3 (x: 300..650, y: 1200..1400)
    let feetDiff = 0, feetPixels = 0;
    for (let y = 1200; y <= 1400; y++) {
      for (let x = 300; x <= 650; x++) {
        const idx = (y * 960 + x) * 4;
        if (d1[idx+3] > 100 && d3[idx+3] > 100) {
          feetDiff += Math.abs(d1[idx] - d3[idx]) + Math.abs(d1[idx+1] - d3[idx+1]) + Math.abs(d1[idx+2] - d3[idx+2]);
          feetPixels++;
        }
      }
    }

    return {
      cupDiffPerPx: cupPixels ? cupDiff / (cupPixels * 3) : null,
      feetDiffPerPx: feetPixels ? feetDiff / (feetPixels * 3) : null,
      cupPixels,
      feetPixels
    };
  }, { p1, p3 });

  console.log('Alignment test:', diff);
  await browser.close();
}

checkPoseAlignment().catch(console.error);
