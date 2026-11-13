import { chromium } from "playwright";

async function run() {
  console.log("Connecting Playwright Chrome to existing server at http://localhost:3000...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const missingAssets = [];
  page.on("response", (res) => {
    if (res.status() === 404) {
      missingAssets.push(res.url());
    }
  });

  const consoleLogs = [];
  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Wait for preloader to finish
  await page.waitForTimeout(3000);

  // Check character elements
  const characterRoot = await page.$(".upper");
  console.log("Character element .upper found in DOM:", !!characterRoot);

  if (missingAssets.length > 0) {
    console.log("\n404 Assets captured during page load:");
    missingAssets.forEach((u) => console.log("  - 404:", u));
  }

  // Scroll to section #architecture
  console.log("\nScrolling to #architecture...");
  await page.evaluate(() => {
    const el = document.getElementById("architecture");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1000);

  const getRotations = async () => {
    return await page.evaluate(() => {
      const getT = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).transform : "null";
      };
      return {
        upper: getT(".upper"),
        fore: getT(".fore"),
        hand: getT(".hand"),
      };
    });
  };

  console.log("Initial joint transforms:", await getRotations());

  // Perform scroll step increments
  console.log("\nScrubbing scroll down through PhilosophySection...");
  for (let i = 1; i <= 6; i++) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(400);
    console.log(`Scroll step ${i}:`, await getRotations());
  }

  // Perform scroll step reverse
  console.log("\nScrubbing scroll back UP (reversal check)...");
  for (let i = 1; i <= 3; i++) {
    await page.mouse.wheel(0, -180);
    await page.waitForTimeout(400);
    console.log(`Scroll up step ${i}:`, await getRotations());
  }

  await page.screenshot({ path: "scripts/live_character_test.png" });
  console.log("\nSaved test screenshot to scripts/live_character_test.png");

  await browser.close();
  console.log("Test finished.");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
