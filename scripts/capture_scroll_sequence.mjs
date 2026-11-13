import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('scripts/verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureSequence() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Get bounding rect of #works
  const worksBox = await page.locator('#works').boundingBox();
  console.log('Works bounding box:', worksBox);

  if (!worksBox) {
    throw new Error('Could not find #works');
  }

  // State 1: Top of #works - Title pinned in center, first card peeking in
  await page.evaluate((top) => window.scrollTo(0, top), worksBox.y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'state1_works_initial_title.png') });
  console.log('Saved state1_works_initial_title.png');

  // State 2: Card 1 (InMind OMS) enters & overlaps "Selected", caption illuminates
  await page.evaluate((top) => window.scrollTo(0, top + 600), worksBox.y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'state2_card1_inmind_active.png') });
  console.log('Saved state2_card1_inmind_active.png');

  // State 3: Cursor hover over Card 1
  const firstCard = page.locator('.work-card').nth(0);
  await firstCard.hover({ position: { x: 300, y: 250 } });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'state3_card1_hover_tag.png') });
  console.log('Saved state3_card1_hover_tag.png');

  // State 4: Card 2 (MadinaBites) enters on right & overlaps "work", caption transitions
  await page.evaluate((top) => window.scrollTo(0, top + 1500), worksBox.y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'state4_card2_madinabites_active.png') });
  console.log('Saved state4_card2_madinabites_active.png');

  // State 5: Card 3 (AgenticArmor) enters on left & overlaps "Selected"
  await page.evaluate((top) => window.scrollTo(0, top + 2400), worksBox.y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'state5_card3_agenticarmor_active.png') });
  console.log('Saved state5_card3_agenticarmor_active.png');

  // State 6: Card 4 (Prism Spatial Studio) enters on right & overlaps "work"
  await page.evaluate((top) => window.scrollTo(0, top + 3300), worksBox.y);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'state6_card4_prism_active.png') });
  console.log('Saved state6_card4_prism_active.png');

  // State 7: Mobile Viewport (390 x 844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // Wait for preloader to complete
  await mobilePage.waitForTimeout(3000);
  const mobileWorks = mobilePage.locator('#works');
  await mobileWorks.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(outDir, 'state7_mobile_heading.png') });
  console.log('Saved state7_mobile_heading.png');

  await mobilePage.evaluate(() => window.scrollBy(0, 600));
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(outDir, 'state8_mobile_cards.png') });
  console.log('Saved state8_mobile_cards.png');

  await browser.close();
  console.log('All states captured successfully!');
}

captureSequence().catch((e) => {
  console.error(e);
  process.exit(1);
});

