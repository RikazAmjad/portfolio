import { chromium } from 'playwright';
import fs from 'fs';

async function inspectAlignment() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const d1 = 'data:image/jpeg;base64,' + fs.readFileSync('public/one.jpg').toString('base64');
  const d2 = 'data:image/jpeg;base64,' + fs.readFileSync('public/two.jpg').toString('base64');
  const d3 = 'data:image/jpeg;base64,' + fs.readFileSync('public/three.jpg').toString('base64');

  const result = await page.evaluate(async ({ d1, d2, d3 }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [i1, i2, i3] = await Promise.all([load(d1), load(d2), load(d3)]);

    return {
      img1: { w: i1.naturalWidth, h: i1.naturalHeight },
      img2: { w: i2.naturalWidth, h: i2.naturalHeight },
      img3: { w: i3.naturalWidth, h: i3.naturalHeight },
      ratioH: i3.naturalHeight / i1.naturalHeight,
    };
  }, { d1, d2, d3 });

  console.log(result);
  await browser.close();
}

inspectAlignment().catch(console.error);
