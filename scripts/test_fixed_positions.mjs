import { chromium } from 'playwright';
import fs from 'fs';

async function testFixedPositions() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 960, height: 1440 });

  // Read the 7 puppet assets as data URLs:
  const assets = {
    body: 'data:image/png;base64,' + fs.readFileSync('public/character/puppet_body.png').toString('base64'),
    pocket: 'data:image/png;base64,' + fs.readFileSync('public/character/arm_pocket.png').toString('base64'),
    exit: 'data:image/png;base64,' + fs.readFileSync('public/character/arm_exit.png').toString('base64'),
    sleeve: 'data:image/png;base64,' + fs.readFileSync('public/character/arm_raised_sleeve.png').toString('base64'),
    hand: 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_hand.png').toString('base64'),
    lip: 'data:image/png;base64,' + fs.readFileSync('public/character/pocket_lip.png').toString('base64'),
    smile: 'data:image/png;base64,' + fs.readFileSync('public/character/face_smile.png').toString('base64'),
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; background: #F7F8F3; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
          .puppet { position: relative; width: 960px; height: 1440px; }
          .layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <div class="puppet">
          <img id="body" class="layer" style="z-index: 10;" src="${assets.body}" />
          <img id="pocket" class="layer" style="z-index: 20; transform-origin: 34.9% 26.4%;" src="${assets.pocket}" />
          <img id="lip" class="layer" style="z-index: 25;" src="${assets.lip}" />
          <img id="exit" class="layer" style="z-index: 30; transform-origin: 34.9% 26.4%;" src="${assets.exit}" />
          <img id="sleeve" class="layer" style="z-index: 30; transform-origin: 34.9% 26.4%;" src="${assets.sleeve}" />
          <img id="hand" class="layer" style="z-index: 31; transform-origin: 24.8% 29.0%;" src="${assets.hand}" />
          <img id="smile" class="layer" style="z-index: 40;" src="${assets.smile}" />
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);

  // Helper to set puppet state
  async function setState({ pocketOp, exitOp, sleeveOp, handOp, lipOp, smileOp, armRot = 0, handRot = 0 }) {
    await page.evaluate(({ pocketOp, exitOp, sleeveOp, handOp, lipOp, smileOp, armRot, handRot }) => {
      document.getElementById('pocket').style.opacity = pocketOp;
      document.getElementById('exit').style.opacity = exitOp;
      document.getElementById('sleeve').style.opacity = sleeveOp;
      document.getElementById('hand').style.opacity = handOp;
      document.getElementById('lip').style.opacity = lipOp;
      document.getElementById('smile').style.opacity = smileOp;

      document.getElementById('pocket').style.transform = `rotate(${armRot}deg)`;
      document.getElementById('exit').style.transform = `rotate(${armRot}deg)`;
      document.getElementById('sleeve').style.transform = `rotate(${armRot}deg)`;
      document.getElementById('hand').style.transform = `rotate(${handRot}deg)`;
    }, { pocketOp, exitOp, sleeveOp, handOp, lipOp, smileOp, armRot, handRot });
    await page.waitForTimeout(100);
  }

  // 1. Position 0%: Hand inside pocket, neutral face
  await setState({ pocketOp: 1, exitOp: 0, sleeveOp: 0, handOp: 0, lipOp: 1, smileOp: 0, armRot: 0, handRot: 0 });
  await page.screenshot({ path: 'public/character_test_0pct.png' });
  console.log('Saved 0% screenshot');

  // 2. Position 25%: Hand cleanly out of pocket, neutral face
  await setState({ pocketOp: 0, exitOp: 1, sleeveOp: 0, handOp: 0, lipOp: 0, smileOp: 0, armRot: 0, handRot: 0 });
  await page.screenshot({ path: 'public/character_test_25pct.png' });
  console.log('Saved 25% screenshot');

  // 3. Position 50%: Arm raised in waving pose, smiling face
  await setState({ pocketOp: 0, exitOp: 0, sleeveOp: 1, handOp: 1, lipOp: 0, smileOp: 1, armRot: 0, handRot: 0 });
  await page.screenshot({ path: 'public/character_test_50pct.png' });
  console.log('Saved 50% screenshot');

  // 4. Position 80%: Waving hand tilted right (+14deg), smiling face
  await setState({ pocketOp: 0, exitOp: 0, sleeveOp: 1, handOp: 1, lipOp: 0, smileOp: 1, armRot: 0, handRot: 14 });
  await page.screenshot({ path: 'public/character_test_80pct.png' });
  console.log('Saved 80% screenshot');

  // 5. Position 100%: Rest pose held, smiling face
  await setState({ pocketOp: 0, exitOp: 0, sleeveOp: 1, handOp: 1, lipOp: 0, smileOp: 1, armRot: 0, handRot: 0 });
  await page.screenshot({ path: 'public/character_test_100pct.png' });
  console.log('Saved 100% screenshot');

  await browser.close();
}

testFixedPositions().catch(console.error);
