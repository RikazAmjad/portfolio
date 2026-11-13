import { chromium } from 'playwright';
import fs from 'fs';

async function inspectPoses() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p1 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose1.png').toString('base64');
  const p2 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose2.png').toString('base64');
  const p3 = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const info = await page.evaluate(async ({ p1, p2, p3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i2, i3] = await Promise.all([load(p1), load(p2), load(p3)]);
    return {
      p1: { w: i1.naturalWidth, h: i1.naturalHeight },
      p2: { w: i2.naturalWidth, h: i2.naturalHeight },
      p3: { w: i3.naturalWidth, h: i3.naturalHeight },
    };
  }, { p1, p2, p3 });

  console.log(info);
  await browser.close();
}

inspectPoses().catch(console.error);
