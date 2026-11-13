import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('scripts/verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function verify() {
  console.log('Connecting to existing Next.js server at http://localhost:3000...');
  
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));

  // 1. Desktop Test (1440 x 900)
  console.log('\n--- 1. Testing Desktop Viewport (1440 x 900) ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to #works
  const worksSection = page.locator('#works');
  await worksSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(outDir, '01_desktop_works_top.png') });
  console.log('Saved 01_desktop_works_top.png');

  // Scroll slightly down to get the first card (InMind OMS) across reading line
  await page.evaluate(() => window.scrollBy(0, 550));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '02_desktop_card1_inmind.png') });
  console.log('Saved 02_desktop_card1_inmind.png');

  // Hover over the first card to verify cursor tag
  const firstCard = page.locator('.work-card').first();
  await firstCard.hover();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '03_desktop_hover_tag.png') });
  console.log('Saved 03_desktop_hover_tag.png');

  // Scroll down to Card 2 (MadinaBites)
  await page.evaluate(() => window.scrollBy(0, 950));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '04_desktop_card2_madinabites.png') });
  console.log('Saved 04_desktop_card2_madinabites.png');

  // Scroll down to Card 3 (AgenticArmor) & Card 4 (Prism Studio)
  await page.evaluate(() => window.scrollBy(0, 1050));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '05_desktop_card3_agenticarmor.png') });
  console.log('Saved 05_desktop_card3_agenticarmor.png');

  await page.evaluate(() => window.scrollBy(0, 1050));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '06_desktop_card4_prism.png') });
  console.log('Saved 06_desktop_card4_prism.png');

  // Click on active card to verify ProjectModal opens
  const activeBtn = page.locator('.work__caption button');
  if (await activeBtn.isVisible()) {
    await activeBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '07_desktop_project_modal.png') });
    console.log('Saved 07_desktop_project_modal.png');
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 2. Tablet Test (768 x 1024)
  console.log('\n--- 2. Testing Tablet Viewport (768 x 1024) ---');
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await tabletPage.locator('#works').scrollIntoViewIfNeeded();
  await tabletPage.waitForTimeout(800);
  await tabletPage.screenshot({ path: path.join(outDir, '08_tablet_works.png') });
  console.log('Saved 08_tablet_works.png');

  // 3. Mobile Test (390 x 844)
  console.log('\n--- 3. Testing Mobile Viewport (390 x 844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.locator('#works').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(outDir, '09_mobile_works_top.png') });
  console.log('Saved 09_mobile_works_top.png');

  await mobilePage.evaluate(() => window.scrollBy(0, 600));
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(outDir, '10_mobile_card_flow.png') });
  console.log('Saved 10_mobile_card_flow.png');

  await browser.close();
  console.log('\nAll browser verification screenshots completed successfully!');
}

verify().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});

