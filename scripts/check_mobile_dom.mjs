import { chromium } from 'playwright';

async function checkMobileDom() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const works = page.locator('#works');
  const innerHtml = await works.innerHTML();
  console.log('--- #works innerHTML ---');
  console.log(innerHtml.slice(0, 2000));

  const visibleTexts = await page.evaluate(() => {
    const el = document.querySelector('#works');
    return Array.from(el.querySelectorAll('*')).filter(e => e.children.length === 0 && e.textContent.trim()).map(e => ({
      tag: e.tagName,
      class: e.className,
      text: e.textContent.trim(),
      visible: window.getComputedStyle(e).display !== 'none' && window.getComputedStyle(e).visibility !== 'hidden'
    }));
  });
  console.log('\n--- Visible text elements ---');
  console.log(visibleTexts.slice(0, 20));

  await browser.close();
}

checkMobileDom().catch(console.error);

