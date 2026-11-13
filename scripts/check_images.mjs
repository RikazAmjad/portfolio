import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const b64 = (file) => 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
  
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  await page.setContent(`
    <html>
      <body style="background: #18181b; color: #fff; font-family: sans-serif; display: flex; gap: 24px; padding: 24px; flex-wrap: wrap;">
        <div style="background:#27272a; padding:12px; border-radius:8px;">
          <h4 style="margin:0 0 8px;">one.jpg</h4>
          <img src="${b64('public/one.jpg')}" style="max-width: 280px; max-height: 400px; object-fit: contain;" />
        </div>
        <div style="background:#27272a; padding:12px; border-radius:8px;">
          <h4 style="margin:0 0 8px;">two.jpg</h4>
          <img src="${b64('public/two.jpg')}" style="max-width: 280px; max-height: 400px; object-fit: contain;" />
        </div>
        <div style="background:#27272a; padding:12px; border-radius:8px;">
          <h4 style="margin:0 0 8px;">three.jpg</h4>
          <img src="${b64('public/three.jpg')}" style="max-width: 280px; max-height: 400px; object-fit: contain;" />
        </div>
        <div style="background:#27272a; padding:12px; border-radius:8px;">
          <h4 style="margin:0 0 8px;">coding.jpg</h4>
          <img src="${b64('public/coding.jpg')}" style="max-width: 280px; max-height: 400px; object-fit: contain;" />
        </div>
      </body>
    </html>
  `);
  
  await page.screenshot({ path: 'scripts/inspect_images.png' });
  await browser.close();
  console.log('Saved scripts/inspect_images.png');
}

main().catch(console.error);
