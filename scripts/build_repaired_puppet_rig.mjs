import { chromium } from 'playwright';
import fs from 'fs';

async function buildRepairedPuppetRig() {
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

    // Canvas 1: p1 (dx: 0, dy: 0)
    const c1 = document.createElement('canvas');
    c1.width = W; c1.height = H;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(p1, 0, 0);

    // Canvas 2: p2 aligned to p1 (p2 relative to p3 was dx: 2, dy: 9; p1 relative to p3 was dx: -4, dy: 10 -> p2 relative to p1 is dx: 6, dy: -1)
    const c2 = document.createElement('canvas');
    c2.width = W; c2.height = H;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(p2, 6, -1);

    // Canvas 3: p3 aligned to p1 (dx: 4, dy: -10)
    const c3 = document.createElement('canvas');
    c3.width = W; c3.height = H;
    const ctx3 = c3.getContext('2d');
    ctx3.drawImage(p3, 4, -10);

    const d1 = ctx1.getImageData(0, 0, W, H).data;
    const d2 = ctx2.getImageData(0, 0, W, H).data;
    const d3 = ctx3.getImageData(0, 0, W, H).data;

    // ── 1. CLEAN BASE CHARACTER BODY (NO MOVING ARM) ──
    const baseC = document.createElement('canvas');
    baseC.width = W; baseC.height = H;
    const bCtx = baseC.getContext('2d');
    bCtx.drawImage(c1, 0, 0); // Start with p1

    const bd = bCtx.getImageData(0, 0, W, H);

    function getTorsoBoundary(y) {
      if (y < 340) return 0; // Head, hair, cap, face untouched
      if (y < 380) return 390 - Math.sin(((y - 340) / 40) * (Math.PI / 2)) * 68; // curves to 322
      if (y < 420) return 322 + Math.sin(((y - 380) / 40) * (Math.PI / 2)) * 6; // 328
      if (y < 450) return 328 + ((y - 420) / 30) * 5; // armpit 333
      if (y < 650) return 333 + ((y - 450) / 200) * 3; // 336 waist
      if (y < 850) return 336 - ((y - 650) / 200) * 11; // 325 hip
      return 0;
    }

    // Clear moving arm region from p1
    for (let y = 340; y < 850; y++) {
      const edge = getTorsoBoundary(y);
      for (let x = 0; x < edge; x++) {
        bd.data[(y * W + x) * 4 + 3] = 0;
      }
    }

    // Inpaint clean empty pocket and flank from c3
    for (let y = 375; y <= 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      if (y >= 640 && y <= 820) {
        for (let x = edge; x <= 415; x++) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            bd.data[idx] = d3[idx];
            bd.data[idx+1] = d3[idx+1];
            bd.data[idx+2] = d3[idx+2];
            bd.data[idx+3] = d3[idx+3];
          }
        }
        for (let x = 415; x <= 435; x++) {
          const idx = (y * W + x) * 4;
          const t = (x - 415) / 20;
          bd.data[idx] = Math.round(d3[idx] * (1 - t) + d1[idx] * t);
          bd.data[idx+1] = Math.round(d3[idx+1] * (1 - t) + d1[idx+1] * t);
          bd.data[idx+2] = Math.round(d3[idx+2] * (1 - t) + d1[idx+2] * t);
        }
      } else if (y >= 450) {
        for (let x = edge; x <= edge + 45; x++) {
          const idx = (y * W + x) * 4;
          if (d3[idx + 3] > 20) {
            const t = (x - edge) / 45;
            bd.data[idx] = Math.round(d3[idx] * (1 - t) + d1[idx] * t);
            bd.data[idx+1] = Math.round(d3[idx+1] * (1 - t) + d1[idx+1] * t);
            bd.data[idx+2] = Math.round(d3[idx+2] * (1 - t) + d1[idx+2] * t);
            bd.data[idx+3] = Math.max(d1[idx+3], d3[idx+3]);
          }
        }
      }
    }

    // Edge anti-aliasing along torso boundary
    for (let y = 340; y < 850; y++) {
      const edge = Math.round(getTorsoBoundary(y));
      if (edge > 0) {
        const idx = (y * W + edge) * 4;
        if (bd.data[idx + 3] > 0) bd.data[idx + 3] = Math.round(bd.data[idx + 3] * 0.7);
      }
    }
    bCtx.putImageData(bd, 0, 0);

    // ── 2. POCKET ARM (Pose 1 arm only) ──
    // In p1, the moving arm is bounded by x: 230..385, y: 350..815
    const arm1C = document.createElement('canvas');
    arm1C.width = W; arm1C.height = H;
    const a1Ctx = arm1C.getContext('2d');
    const a1Img = a1Ctx.createImageData(W, H);
    const a1d = a1Img.data;

    for (let y = 350; y <= 820; y++) {
      // Inner boundary where arm touches torso:
      let innerX = 345;
      if (y < 420) innerX = 350 - ((y - 350) / 70) * 15;
      else if (y < 500) innerX = 335 - ((y - 420) / 80) * 10;
      else if (y < 600) innerX = 325 + ((y - 500) / 100) * 12;
      else if (y < 700) innerX = 337 + ((y - 600) / 100) * 35;
      else innerX = 372 + ((y - 700) / 120) * 20;

      for (let x = 220; x <= innerX + 6; x++) {
        const idx = (y * W + x) * 4;
        if (d1[idx + 3] > 20) {
          a1d[idx] = d1[idx];
          a1d[idx+1] = d1[idx+1];
          a1d[idx+2] = d1[idx+2];
          if (x > innerX) {
            const f = (innerX + 6 - x) / 6;
            a1d[idx+3] = Math.round(d1[idx+3] * Math.max(0, Math.min(1, f)));
          } else {
            a1d[idx+3] = d1[idx+3];
          }
        }
      }
    }
    a1Ctx.putImageData(a1Img, 0, 0);

    // ── 3. POCKET EXIT ARM (Pose 2 arm only) ──
    // In c2, the arm has the hand pulled out of the pocket!
    const arm2C = document.createElement('canvas');
    arm2C.width = W; arm2C.height = H;
    const a2Ctx = arm2C.getContext('2d');
    const a2Img = a2Ctx.createImageData(W, H);
    const a2d = a2Img.data;

    for (let y = 350; y <= 825; y++) {
      let innerX = 345;
      if (y < 420) innerX = 350 - ((y - 350) / 70) * 15;
      else if (y < 500) innerX = 335 - ((y - 420) / 80) * 10;
      else if (y < 600) innerX = 325 + ((y - 500) / 100) * 12;
      else if (y < 700) innerX = 337 + ((y - 600) / 100) * 35;
      else innerX = 375 + ((y - 700) / 125) * 20;

      for (let x = 220; x <= innerX + 6; x++) {
        const idx = (y * W + x) * 4;
        if (d2[idx + 3] > 20) {
          // Exclude brown pants if x > 350 and y > 760 and color is brown
          const r = d2[idx], g = d2[idx+1], b = d2[idx+2];
          const isBrownPants = (y > 760 && x > 345 && r > 110 && r < 165 && g > 75 && g < 115 && b > 55 && b < 90);
          if (!isBrownPants) {
            a2d[idx] = d2[idx];
            a2d[idx+1] = d2[idx+1];
            a2d[idx+2] = d2[idx+2];
            if (x > innerX) {
              const f = (innerX + 6 - x) / 6;
              a2d[idx+3] = Math.round(d2[idx+3] * Math.max(0, Math.min(1, f)));
            } else {
              a2d[idx+3] = d2[idx+3];
            }
          }
        }
      }
    }
    a2Ctx.putImageData(a2Img, 0, 0);

    // ── 4. RAISED SLEEVE (Pose 3 sleeve only) ──
    // In c3, the raised sleeve runs from shoulder socket (335, 380) to cuff (234, 405)
    // Hand starts above wrist line (y <= 405)
    const rSleeveC = document.createElement('canvas');
    rSleeveC.width = W; rSleeveC.height = H;
    const rsCtx = rSleeveC.getContext('2d');
    const rsImg = rsCtx.createImageData(W, H);
    const rsd = rsImg.data;

    for (let y = 330; y <= 550; y++) {
      for (let x = 160; x <= 360; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          // Exclude hand: hand skin is y < 405 and x < 265
          const r = d3[idx], g = d3[idx+1], b = d3[idx+2];
          const isSkin = (r > 190 && g > 130 && b > 110 && r > b + 30);
          if (!isSkin && (y >= 405 || x >= 230)) {
            // Keep sleeve fabric
            rsd[idx] = d3[idx];
            rsd[idx+1] = d3[idx+1];
            rsd[idx+2] = d3[idx+2];
            rsd[idx+3] = d3[idx+3];
          }
        }
      }
    }
    rsCtx.putImageData(rsImg, 0, 0);

    // ── 5. WAVING HAND (Pose 3 hand only) ──
    const handC = document.createElement('canvas');
    handC.width = W; handC.height = H;
    const hCtx = handC.getContext('2d');
    const hImg = hCtx.createImageData(W, H);
    const hd = hImg.data;

    // Hand in c3: x: 165..295, y: 190..425
    for (let y = 190; y <= 425; y++) {
      for (let x = 165; x <= 295; x++) {
        const idx = (y * W + x) * 4;
        if (d3[idx + 3] > 20) {
          const r = d3[idx], g = d3[idx+1], b = d3[idx+2];
          const isSkin = (r > 180 && g > 120 && b > 100 && r > b + 25);
          // Hand plus small wrist cuff overlap (y <= 420):
          if (isSkin || (y <= 415 && x < 250)) {
            hd[idx] = d3[idx];
            hd[idx+1] = d3[idx+1];
            hd[idx+2] = d3[idx+2];
            hd[idx+3] = d3[idx+3];
          }
        }
      }
    }
    hCtx.putImageData(hImg, 0, 0);

    // ── 6. POCKET LIP (Welt of empty hoodie pocket from c3) ──
    const lipC = document.createElement('canvas');
    lipC.width = W; lipC.height = H;
    const lCtx = lipC.getContext('2d');
    const lImg = lCtx.createImageData(W, H);
    const ld = lImg.data;

    // The pocket lip in c3 is along y: 640..800, x: 335..385
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

    // ── 7. LOCALIZED SMILE OVERLAY ──
    const smileC = document.createElement('canvas');
    smileC.width = W; smileC.height = H;
    const smCtx = smileC.getContext('2d');
    const smImg = smCtx.createImageData(W, H);
    const smd = smImg.data;

    // Smiling mouth in c3 is around x: 478, y: 330. Radius ~25px
    const cx = 478, cy = 330, rx = 32, ry = 22;
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
            // Smooth alpha feathering
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
  console.log('Saved all repaired puppet assets to public/character/ successfully!');
  await browser.close();
}

buildRepairedPuppetRig().catch(console.error);
