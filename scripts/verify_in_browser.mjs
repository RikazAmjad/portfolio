import { spawn } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('scripts/verification');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Server did not respond at ${url} within ${timeout}ms`);
}

async function run() {
  console.log('Starting Next.js dev server on port 3005...');
  const devProcess = spawn('npx.cmd', ['next', 'dev', '-p', '3005'], {
    stdio: 'pipe',
    shell: true,
  });

  devProcess.stdout.on('data', (d) => process.stdout.write(d.toString()));
  devProcess.stderr.on('data', (d) => process.stderr.write(d.toString()));

  try {
    await waitForServer('http://localhost:3005');
    console.log('Dev server is up and running on http://localhost:3005!');

    const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));

    // 1. Desktop Test (1440 x 900)
    console.log('\n--- 1. Testing Desktop Viewport (1440 x 900) ---');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to #works
    const worksSection = page.locator('#works');
    await worksSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(outDir, '01_desktop_works_top.png') });
    console.log('Saved 01_desktop_works_top.png');

    // Scroll slightly down to get the first card across reading line
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '02_desktop_card1_inmind.png') });
    console.log('Saved 02_desktop_card1_inmind.png');

    // Hover over the first card to verify cursor tag
    const firstCard = page.locator('.work-card').first();
    await firstCard.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, '03_desktop_hover_tag.png') });
    console.log('Saved 03_desktop_hover_tag.png');

    // Scroll down to Card 2 (MadinaBites)
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '04_desktop_card2_madinabites.png') });
    console.log('Saved 04_desktop_card2_madinabites.png');

    // Scroll down to Card 3 (AgenticArmor) & Card 4 (Prism Studio)
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '05_desktop_card3_agenticarmor.png') });
    console.log('Saved 05_desktop_card3_agenticarmor.png');

    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '06_desktop_card4_prism.png') });
    console.log('Saved 06_desktop_card4_prism.png');

    // Click on active card to verify ProjectModal opens
    const activeBtn = page.locator('.work__caption button');
    if (await activeBtn.isVisible()) {
      await activeBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, '07_desktop_project_modal.png') });
      console.log('Saved 07_desktop_project_modal.png');
      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 2. Tablet Test (768 x 1024)
    console.log('\n--- 2. Testing Tablet Viewport (768 x 1024) ---');
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto('http://localhost:3005', { waitUntil: 'networkidle' });
    await tabletPage.locator('#works').scrollIntoViewIfNeeded();
    await tabletPage.waitForTimeout(600);
    await tabletPage.screenshot({ path: path.join(outDir, '08_tablet_works.png') });
    console.log('Saved 08_tablet_works.png');

    // 3. Mobile Test (390 x 844)
    console.log('\n--- 3. Testing Mobile Viewport (390 x 844) ---');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:3005', { waitUntil: 'networkidle' });
    await mobilePage.locator('#works').scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: path.join(outDir, '09_mobile_works_top.png') });
    console.log('Saved 09_mobile_works_top.png');

    await mobilePage.evaluate(() => window.scrollBy(0, 600));
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(outDir, '10_mobile_card_flow.png') });
    console.log('Saved 10_mobile_card_flow.png');

    await browser.close();
    console.log('\nAll browser verification screenshots completed successfully!');
  } finally {
    console.log('Shutting down dev server...');
    devProcess.kill();
    // On Windows, kill child tree if needed
    try {
      spawn('taskkill', ['/pid', devProcess.pid.toString(), '/f', '/t'], { shell: true });
    } catch (e) {}
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

