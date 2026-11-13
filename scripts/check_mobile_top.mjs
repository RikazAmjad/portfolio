import { chromium } from 'playwright';
import path from 'path';

async function checkMobileTop() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const works = page.locator('#works');
  const box = await works.boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), box.y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('scripts/verification/00_mobile_top_exact.png') });
  console.log('Saved 00_mobile_top_exact.png');

  await browser.close();
}

checkMobileTop().catch(console.error);

