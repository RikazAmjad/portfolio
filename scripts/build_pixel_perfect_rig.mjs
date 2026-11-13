import { chromium } from 'playwright';
import fs from 'fs';

async function buildPixelPerfectRig() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const p1Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose1.png').toString('base64');
  const p2Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose2.png').toString('base64');
  const p3Data = 'data:image/png;base64,' + fs.readFileSync('public/character/pose3_full.png').toString('base64');

  const assets = await page.evaluate(async ({ p1Data, p2Data, p3Data }) => {
    function load(src) {
      return new Promise(res => { const img = new Image(); img.onload = () => res(img); img.src = src; });
    }
    const [p1, p2, p3] = await Promise.all([load(p1Data), load(p2Data), load(p3Data)]);
    const W = 960, H = 1440;

    // Canvas 1: Pose 1 (Canonical base)
    const c1 = document.createElement('canvas');
    c1.width = W; c1.height = H;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(p1, 0, 0);

    // Canvas 2: Pose 2 aligned with Pose 1 (shift: +6, -1)
    const c2 = document.createElement('canvas');
    c2.width = W; c2.height = H;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(p2, 6, -1);

    // Canvas 3: Pose 3 aligned with Pose 1 (shift: +4, -10)
    const c3 = document.createElement('canvas');
    c3.width = W; c3.height = H;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(p3, 4, -10);

    const d1 = ctx1.getImageData(0, 0, W, H).data;
    const d2 = ctx2.getImageData(0, 0, W, H).data;
    const d3 = ctx3.getImageData(0, 0, W, H).data;

    function isSkinColor(r, g, b) {
      return r > 175 && g > 115 && b > 95 && r > b + 25;
    }

    // ─────────────────────────────────────────────────────────────
    // 1. CLEAN BASE CHARACTER BODY (NO MOVING ARM)
    // ─────────────────────────────────────────────────────────────
    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');
    bCtx.drawImage(c1, 0, 0);
    const bd = bCtx.getImageData(0, 0, W, H);

    function trueTorsoSeam(y) {
      if (y < 335) return 0; // Head, hair, cap
      if (y < 370) return 372 - ((y - 335) / 35) * 7;  // 372 -> 365
      if (y < 420) return 365 - ((y - 370) / 50) * 8;  // 365 -> 357
      if (y < 480) return 357 - ((y - 420) / 60) * 7;  // 357 -> 350
      if (y < 550) return 350 - ((y - 480) / 70) * 10; // 350 -> 340
      if (y < 650) return 340 - ((y - 550) / 100) * 6; // 340 -> 334
      if (y < 850) return 334 - ((y - 650) / 200) * 9; // 334 -> 325
      return 0;
    }

    // Clear entire moving arm region from p1
    for (let y = 335; y < 850; y++) {
      const edge = Math.round(trueTorsoSeam(y));
      for (let x = 0; x < edge; x++) {
        bd.data[(y * W + x) * 4 + 3] = 0;
      }
    }

    // Inpaint empty pocket and torso flank from c3
    for (let y = 375; y <= 850; y++) {
      const edge = Math.round(trueTorsoSeam(y));
      if (y >= 640 && y <= 820) {
        for (let x = edge; x <= 425; x++) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            bd.data[idx] = d3[idx];
            bd.data[idx+1] = d3[idx+1];
            bd.data[idx+2] = d3[idx+2];
            bd.data[idx+3] = d3[idx+3];
          }
        }
      }
    }

    // Edge anti-aliasing
    for (let y = 335; y < 850; y++) {
      const edge = Math.round(trueTorsoSeam(y));
      if (edge > 0) {
        const idx = (y * W + edge) * 4;
        if (bd.data[idx + 3] > 0) bd.data[idx + 3] = Math.round(bd.data[idx + 3] * 0.7);
      }
    }
    bCtx.putImageData(bd, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 2. POCKET ARM (Pure Arm + Hand entering pocket, NO PANTS)
    // ─────────────────────────────────────────────────────────────
    const arm1C = document.createElement('canvas');
    arm1C.width = W; arm1C.height = H;
    const a1Ctx = arm1C.getContext('2d');
    const a1Img = a1Ctx.createImageData(W, H);
    const a1d = a1Img.data;

    for (let y = 330; y <= 830; y++) {
      let innerX = 385;
      if (y < 420) innerX = 390;
      else if (y < 500) innerX = 385;
      else if (y < 600) innerX = 380;
      else if (y < 700) innerX = 375;
      else innerX = 385;

      for (let x = 200; x <= innerX; x++) {
        const idx = (y * W + x) * 4;
        if (d1[idx + 3] > 20) {
          const r = d1[idx], g = d1[idx+1], b = d1[idx+2];
          // For y > 760 (below cuff), only keep skin tone (exclude pants):
          if (y > 760 && !isSkinColor(r, g, b)) {
            continue;
          }
          a1d[idx] = d1[idx];
          a1d[idx+1] = d1[idx+1];
          a1d[idx+2] = d1[idx+2];
          a1d[idx+3] = d1[idx+3];
        }
      }
    }
    a1Ctx.putImageData(a1Img, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 3. POCKET EXIT ARM (Hand pulled out of pocket, NO PANTS)
    // ─────────────────────────────────────────────────────────────
    const arm2C = document.createElement('canvas');
    arm2C.width = W; arm2C.height = H;
    const a2Ctx = arm2C.getContext('2d');
    const a2Img = a2Ctx.createImageData(W, H);
    const a2d = a2Img.data;

    for (let y = 330; y <= 830; y++) {
      let innerX = 385;
      if (y < 420) innerX = 390;
      else if (y < 500) innerX = 385;
      else if (y < 600) innerX = 380;
      else if (y < 700) innerX = 375;
      else innerX = 385;

      for (let x = 200; x <= innerX; x++) {
        const idx = (y * W + x) * 4;
        if (d2[idx + 3] > 20) {
          const r = d2[idx], g = d2[idx+1], b = d2[idx+2];
          if (y > 740 && x > 340 && !isSkinColor(r, g, b)) {
            continue;
          }
          a2d[idx] = d2[idx];
          a2d[idx+1] = d2[idx+1];
          a2d[idx+2] = d2[idx+2];
          a2d[idx+3] = d2[idx+3];
        }
      }
    }
    a2Ctx.putImageData(a2Img, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 4. RAISED SLEEVE (Full sleeve from cuff to shoulder to elbow)
    // In Pose 3 (shifted +4, -10):
    // Cuff is at y ≈ 418..440, elbow is at y ≈ 620..700, shoulder at y ≈ 360..450.
    // ─────────────────────────────────────────────────────────────
    const rSleeveC = document.createElement('canvas');
    rSleeveC.width = W; rSleeveC.height = H;
    const rsCtx = rSleeveC.getContext('2d');
    const rsImg = rsCtx.createImageData(W, H);
    const rsd = rsImg.data;

    for (let y = 350; y <= 720; y++) {
      for (let x = 160; x <= 360; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          const r = d3[idx], g = d3[idx+1], b = d3[idx+2];
          // Clear skin pixels (the hand)
          if (isSkinColor(r, g, b)) continue;
          // Clear any pixels above the sleeve cuff (y < 418)
          if (y < 418 && x < 260) continue;

          rsd[idx] = d3[idx];
          rsd[idx+1] = d3[idx+1];
          rsd[idx+2] = d3[idx+2];
          rsd[idx+3] = d3[idx+3];
        }
      }
    }
    rsCtx.putImageData(rsImg, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 5. WAVING HAND (Isolated 5-finger hand)
    // Hand is at y: 260..425, x: 170..300.
    // Wrist extends into y ≈ 422 to sit securely inside the sleeve cuff.
    // ─────────────────────────────────────────────────────────────
    const handC = document.createElement('canvas');
    handC.width = W; handC.height = H;
    const hCtx = handC.getContext('2d');
    const hImg = hCtx.createImageData(W, H);
    const hd = hImg.data;

    for (let y = 260; y <= 425; y++) {
      for (let x = 170; x <= 300; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          const r = d3[idx], g = d3[idx+1], b = d3[idx+2];
          // Include skin pixels, plus wrist pixels right at cuff junction:
          if (isSkinColor(r, g, b) || (y <= 422 && x < 255 && d3[idx+3] > 40)) {
            hd[idx] = d3[idx];
            hd[idx+1] = d3[idx+1];
            hd[idx+2] = d3[idx+2];
            hd[idx+3] = d3[idx+3];
          }
        }
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 6. POCKET LIP (Overlay that wraps over the hand in pocket)
    // ─────────────────────────────────────────────────────────────
    const lipC = document.createElement('canvas');
    lipC.width = W; lipC.height = H;
    const lCtx = lipC.getContext('2d');
    const lImg = lCtx.createImageData(W, H);
    const ld = lImg.data;

    for (let y = 640; y <= 800; y++) {
      for (let x = 330; x <= 390; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          ld[idx] = d3[idx];
          ld[idx+1] = d3[idx+1];
          ld[idx+2] = d3[idx+2];
          ld[idx+3] = d3[idx+3];
        }
      }
    }
    lCtx.putImageData(lImg, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // 7. LOCALIZED SMILE OVERLAY
    // ─────────────────────────────────────────────────────────────
    const smileC = document.createElement('canvas');
    smileC.width = W; smileC.height = H;
    const smCtx = smileC.getContext('2d');
    const smImg = smCtx.createImageData(W, H);
    const smd = smImg.data;

    const cx = 478, cy = 330, rx = 30, ry = 20;
    for (let y = cy - ry; y <= cy + ry; y++) {
      for (let x = cx - rx; x <= cx + rx; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const dist = Math.hypot(dx, dy);
        if (dist <= 1.0) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            smd[idx] = d3[idx];
            smd[idx+1] = d3[idx+1];
            smd[idx+2] = d3[idx+2];
            let a = 1.0;
            if (dist > 0.4) a = 1.0 - (dist - 0.4) / 0.6;
            smd[idx+3] = Math.round(d3[idx+3] * a);
          }
        }
      }
    }
    smCtx.putImageData(smImg, 0, 0);

    return {
      puppet_body: baseC.toDataURL('image/png'),
      arm_pocket: arm1C.toDataURL('image/png'),
      arm_exit: arm2C.toDataURL('image/png'),
      arm_raised_sleeve: rSleeveC.toDataURL('image/png'),
      pose3_hand: handC.toDataURL('image/png'),
      pocket_lip: lipC.toDataURL('image/png'),
      face_smile: smileC.toDataURL('image/png'),
    };
  }, { p1Data, p2Data, p3Data });

  for (const [key, val] of Object.entries(assets)) {
    const b64 = val.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(`public/character/${key}.png`, Buffer.from(b64, 'base64'));
  }
  console.log('Saved pixel-perfect puppet assets!');
  await browser.close();
}

buildPixelPerfectRig().catch(console.error);
