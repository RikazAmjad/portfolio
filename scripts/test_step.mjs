import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Scroll to #journey using Lenis element selector
  await page.evaluate(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo('#journey', { immediate: true });
    }
  });
  await page.waitForTimeout(600);

  const steps = [0, 150, 300, 500, 800, 1200];
  for (const step of steps) {
    await page.evaluate((s) => {
      const journey = document.getElementById('journey');
      const startY = journey.getBoundingClientRect().top + window.scrollY;
      if (window.__lenis) {
        window.__lenis.scrollTo(startY + s, { immediate: true });
      }
    }, step);
    await page.waitForTimeout(500);

    const log = await page.evaluate(() => {
      const line = document.querySelector('.journey-line');
      const getScaleY = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return 'missing';
        const st = window.getComputedStyle(el).transform;
        if (st === 'none') return '0';
        const match = st.match(/matrix\([^,]+,[^,]+,[^,]+,\s*([^,]+)/);
        return match ? parseFloat(match[1]).toFixed(2) : st;
      };

      return {
        width: line?.style?.width,
        march_scaleY: getScaleY('.jl-2020-march'),
        nov_scaleY: getScaleY('.jl-2020-november'),
        july_scaleY: getScaleY('.jl-2021-july'),
        oct_scaleY: getScaleY('.jl-2022-october'),
      };
    });

    console.log(`Scroll +${step}px:`, JSON.stringify(log));
    if (step === 150 || step === 300) {
      await page.screenshot({ path: `scripts/verification/scroll_${step}px.png` });
    }
  }

  await browser.close();
}

run().catch(console.error);
