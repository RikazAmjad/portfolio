import { chromium } from 'playwright';
import path from 'path';

async function testModal() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to #works
  const works = page.locator('#works');
  await works.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Scroll so card 1 is active
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(600);

  // Click the first card
  await page.locator('.work-card').first().click();
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.resolve('scripts/verification/modal_open.png') });
  console.log('Saved modal_open.png');

  await browser.close();
}

testModal().catch(console.error);

