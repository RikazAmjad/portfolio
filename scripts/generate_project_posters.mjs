import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generatePosters() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(() => chromium.launch({ channel: 'chrome', headless: true }));
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  // 1. InMind OMS
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1600px;
          height: 1200px;
          background: #0B1118;
          color: #E2E8F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        /* Browser Chrome Bar */
        .window-bar {
          height: 48px;
          background: #070B10;
          border-bottom: 1px solid #1E293B;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
        }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #EF4444; }
        .dot-y { background: #F59E0B; }
        .dot-g { background: #10B981; }
        .address-bar {
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 8px;
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          font-size: 13px;
          color: #94A3B8;
          font-family: monospace;
        }
        .app-body {
          flex: 1;
          display: flex;
        }
        /* Sidebar */
        .sidebar {
          width: 260px;
          background: #090E14;
          border-right: 1px solid #1E293B;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #F8FAFC;
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #F7444E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #FFF;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 14px;
          color: #94A3B8;
          font-weight: 500;
        }
        .nav-item.active {
          background: #1E293B;
          color: #F8FAFC;
        }
        .nav-badge {
          margin-left: auto;
          background: #F7444E;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 99px;
        }
        /* Main Content */
        .main {
          flex: 1;
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          background: radial-gradient(circle at top right, rgba(120, 188, 196, 0.08), transparent 400px), #0B1118;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title { font-size: 28px; font-weight: 700; color: #FFF; }
        .subtitle { font-size: 14px; color: #64748B; margin-top: 4px; }
        .telemetry-pills { display: flex; gap: 12px; }
        .pill {
          background: #131E2B;
          border: 1px solid #1E293B;
          border-radius: 8px;
          padding: 8px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pill-label { font-size: 11px; text-transform: uppercase; color: #64748B; font-family: monospace; }
        .pill-val { font-size: 16px; font-weight: 700; color: #78BCC4; font-family: monospace; }
        /* FSM Pipeline */
        .fsm-card {
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 12px;
          padding: 20px 24px;
        }
        .fsm-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8; margin-bottom: 16px; }
        .fsm-steps { display: flex; align-items: center; justify-content: space-between; position: relative; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; }
        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1E293B;
          border: 2px solid #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          color: #94A3B8;
        }
        .step.done .step-circle { background: #064E3B; border-color: #10B981; color: #34D399; }
        .step.active .step-circle { background: #7F1D1D; border-color: #F7444E; color: #FECDD3; box-shadow: 0 0 20px rgba(247, 68, 78, 0.4); }
        .step-label { font-size: 13px; font-weight: 600; color: #E2E8F0; }
        .step-meta { font-size: 11px; color: #64748B; font-family: monospace; }
        .fsm-line {
          position: absolute;
          top: 22px;
          left: 40px;
          right: 40px;
          height: 2px;
          background: #334155;
          z-index: 1;
        }
        .fsm-line-fill {
          height: 100%;
          width: 60%;
          background: linear-gradient(90deg, #10B981, #F7444E);
        }
        /* Orders Table */
        .table-card {
          flex: 1;
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .table-head {
          display: grid;
          grid-template-columns: 140px 180px 220px 140px 140px 1fr;
          padding: 14px 20px;
          background: #131E2B;
          border-bottom: 1px solid #1E293B;
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          font-family: monospace;
        }
        .table-row {
          display: grid;
          grid-template-columns: 140px 180px 220px 140px 140px 1fr;
          padding: 16px 20px;
          border-bottom: 1px solid #1E293B;
          font-size: 14px;
          align-items: center;
        }
        .table-row:last-child { border-bottom: none; }
        .id-cell { font-family: monospace; color: #78BCC4; font-weight: 600; }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
        }
        .status-badge.syncing { background: rgba(247, 68, 78, 0.15); color: #F7444E; border: 1px solid rgba(247, 68, 78, 0.3); }
        .status-badge.locked { background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-badge.settled { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
      </style>
    </head>
    <body>
      <div class="window-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
        <div class="address-bar">https://oms.inmind.internal/clusters/eu-west-1/fsm</div>
      </div>
      <div class="app-body">
        <div class="sidebar">
          <div class="brand"><div class="brand-icon">IM</div>InMind OMS</div>
          <div class="nav-item active">Order Queues <span class="nav-badge">1,428</span></div>
          <div class="nav-item">State Machine FSM</div>
          <div class="nav-item">Inventory Allocation</div>
          <div class="nav-item">Redis Event Bus</div>
          <div class="nav-item">Idempotent Log</div>
          <div class="nav-item">Postgres Shards</div>
        </div>
        <div class="main">
          <div class="header-row">
            <div>
              <div class="title">Distributed Order State Engine</div>
              <div class="subtitle">High-concurrency finite state machine & multi-channel inventory synchronization</div>
            </div>
            <div class="telemetry-pills">
              <div class="pill"><span class="pill-label">Throughput</span><span class="pill-val">1.2M tx/sec</span></div>
              <div class="pill"><span class="pill-label">P95 Commit</span><span class="pill-val">11.2 ms</span></div>
              <div class="pill"><span class="pill-label">Queue Health</span><span class="pill-val">99.999%</span></div>
            </div>
          </div>
          <div class="fsm-card">
            <div class="fsm-title">Deterministic Transaction Lifecycle (Raft Sync)</div>
            <div class="fsm-steps">
              <div class="fsm-line"><div class="fsm-line-fill"></div></div>
              <div class="step done"><div class="step-circle">✓</div><div class="step-label">01. INGEST</div><div class="step-meta">gRPC FlatBuffers</div></div>
              <div class="step done"><div class="step-circle">✓</div><div class="step-label">02. MEMPOOL</div><div class="step-meta">Lock-free Ring</div></div>
              <div class="step active"><div class="step-circle">03</div><div class="step-label">03. ALLOCATE</div><div class="step-meta">Redis Lock (4ms)</div></div>
              <div class="step"><div class="step-circle">04</div><div class="step-label">04. COMMIT</div><div class="step-meta">Postgres WAL</div></div>
              <div class="step"><div class="step-circle">05</div><div class="step-label">05. DISPATCH</div><div class="step-meta">Webhook Ack</div></div>
            </div>
          </div>
          <div class="table-card">
            <div class="table-head">
              <div>Tx ID</div><div>Customer / SKU</div><div>Payload Size</div><div>FSM State</div><div>Lock Latency</div><div>Node</div>
            </div>
            <div class="table-row">
              <div class="id-cell">#TX-948210</div><div>Acme Global (Tier 1)</div><div>48 KB (gRPC)</div>
              <div><span class="status-badge syncing"><span style="width:6px;height:6px;border-radius:50%;background:#F7444E;"></span>ALLOCATING</span></div>
              <div style="font-family:monospace;color:#78BCC4;">3.4 ms</div><div>eu-west-node-04</div>
            </div>
            <div class="table-row">
              <div class="id-cell">#TX-948209</div><div>HyperScale Retail</div><div>112 KB (gRPC)</div>
              <div><span class="status-badge locked"><span style="width:6px;height:6px;border-radius:50%;background:#FBBF24;"></span>MEMPOOL_REPL</span></div>
              <div style="font-family:monospace;color:#78BCC4;">8.1 ms</div><div>eu-west-node-02</div>
            </div>
            <div class="table-row">
              <div class="id-cell">#TX-948208</div><div>Nordic Logistics</div><div>32 KB (gRPC)</div>
              <div><span class="status-badge settled"><span style="width:6px;height:6px;border-radius:50%;background:#34D399;"></span>COMMITTED</span></div>
              <div style="font-family:monospace;color:#78BCC4;">1.2 ms</div><div>eu-west-node-01</div>
            </div>
            <div class="table-row">
              <div class="id-cell">#TX-948207</div><div>Apex Omnichannel</div><div>84 KB (gRPC)</div>
              <div><span class="status-badge settled"><span style="width:6px;height:6px;border-radius:50%;background:#34D399;"></span>COMMITTED</span></div>
              <div style="font-family:monospace;color:#78BCC4;">1.5 ms</div><div>eu-west-node-03</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: path.join(outDir, 'inmind-oms.webp'), quality: 95 });
  console.log('Generated inmind-oms.webp');

  // 2. MadinaBites Commerce
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1600px;
          height: 1200px;
          background: #FAFAFA;
          color: #18181B;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .window-bar {
          height: 48px;
          background: #FFFFFF;
          border-bottom: 1px solid #E4E4E7;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
        }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #EF4444; }
        .dot-y { background: #F59E0B; }
        .dot-g { background: #10B981; }
        .address-bar {
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          background: #F4F4F5;
          border: 1px solid #E4E4E7;
          border-radius: 8px;
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          font-size: 13px;
          color: #71717A;
          font-family: monospace;
        }
        .app-body {
          flex: 1;
          display: flex;
          background: #F8F9FA;
        }
        .store-content {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .hero-banner {
          background: #002C3E;
          border-radius: 20px;
          padding: 48px 56px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 20px 40px rgba(0, 44, 62, 0.12);
        }
        .hero-title { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
        .hero-sub { font-size: 16px; color: #78BCC4; margin-top: 10px; max-width: 480px; }
        .hero-cta {
          background: #F7444E;
          color: white;
          padding: 14px 28px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .grid-section-title { font-size: 20px; font-weight: 700; color: #18181B; }
        .food-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .food-card {
          background: white;
          border: 1px solid #E4E4E7;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .food-img-mock {
          height: 180px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }
        .card-2 .food-img-mock { background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); }
        .card-3 .food-img-mock { background: linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%); }
        .food-name { font-size: 18px; font-weight: 700; color: #002C3E; }
        .food-desc { font-size: 13px; color: #71717A; line-height: 1.4; }
        .food-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .price { font-size: 20px; font-weight: 800; color: #002C3E; }
        .add-btn { background: #002C3E; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; }
        /* Cart Drawer */
        .cart-drawer {
          width: 420px;
          background: white;
          border-left: 1px solid #E4E4E7;
          display: flex;
          flex-direction: column;
          padding: 32px 28px;
        }
        .cart-title { font-size: 22px; font-weight: 800; color: #002C3E; display: flex; justify-content: space-between; align-items: center; }
        .cart-count { background: #F7444E; color: white; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
        .cart-items { flex: 1; display: flex; flex-direction: column; gap: 16px; margin: 24px 0; }
        .cart-item { display: flex; gap: 14px; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #F4F4F5; }
        .item-thumb { width: 56px; height: 56px; border-radius: 8px; background: #FEF3C7; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .item-info { flex: 1; }
        .item-title { font-size: 14px; font-weight: 700; color: #002C3E; }
        .item-qty { font-size: 12px; color: #71717A; margin-top: 2px; }
        .item-price { font-size: 15px; font-weight: 700; color: #002C3E; }
        .checkout-box { background: #F8F9FA; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .subtotal-row { display: flex; justify-content: space-between; font-size: 14px; color: #71717A; }
        .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #002C3E; padding-top: 8px; border-top: 1px solid #E4E4E7; }
        .checkout-btn {
          background: #F7444E;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          margin-top: 8px;
          box-shadow: 0 10px 20px rgba(247, 68, 78, 0.25);
        }
      </style>
    </head>
    <body>
      <div class="window-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
        <div class="address-bar">https://madinabites.com/order/checkout</div>
      </div>
      <div class="app-body">
        <div class="store-content">
          <div class="hero-banner">
            <div>
              <div class="hero-title">Authentic Culinary Craft.<br>Instant Courier Dispatch.</div>
              <div class="hero-sub">Real-time inventory synchronization, sub-50ms cart transitions, and end-to-end Stripe payment orchestration.</div>
            </div>
            <button class="hero-cta">Order Online →</button>
          </div>
          <div class="grid-section-title">Popular Chef Selections</div>
          <div class="food-grid">
            <div class="food-card">
              <div class="food-img-mock">🍛</div>
              <div class="food-name">Royal Lamb Biryani</div>
              <div class="food-desc">Aromatic slow-cooked basmati rice, caramelized onions, marinated shank.</div>
              <div class="food-footer"><span class="price">$24.50</span><button class="add-btn">Add to Cart</button></div>
            </div>
            <div class="food-card card-2">
              <div class="food-img-mock">🍢</div>
              <div class="food-name">Charcoal Seekh Kabab</div>
              <div class="food-desc">Hand-ground spiced skewers flame-grilled over natural charcoal.</div>
              <div class="food-footer"><span class="price">$18.00</span><button class="add-btn">Add to Cart</button></div>
            </div>
            <div class="food-card card-3">
              <div class="food-img-mock">🫓</div>
              <div class="food-name">Garlic Butter Tandoori Naan</div>
              <div class="food-desc">Clay-oven blistered artisan flatbread finished with roasted herb ghee.</div>
              <div class="food-footer"><span class="price">$6.50</span><button class="add-btn">Add to Cart</button></div>
            </div>
          </div>
        </div>
        <div class="cart-drawer">
          <div class="cart-title">Your Order <span class="cart-count">3 items</span></div>
          <div class="cart-items">
            <div class="cart-item">
              <div class="item-thumb">🍛</div>
              <div class="item-info"><div class="item-title">Royal Lamb Biryani</div><div class="item-qty">Qty: 2 • Extra Raita</div></div>
              <div class="item-price">$49.00</div>
            </div>
            <div class="cart-item">
              <div class="item-thumb" style="background:#FEF3C7;">🍢</div>
              <div class="item-info"><div class="item-title">Charcoal Seekh Kabab</div><div class="item-qty">Qty: 1 • Mint Chutney</div></div>
              <div class="item-price">$18.00</div>
            </div>
            <div class="cart-item">
              <div class="item-thumb" style="background:#CCFBF1;">🫓</div>
              <div class="item-info"><div class="item-title">Garlic Butter Naan</div><div class="item-qty">Qty: 2 • Blistered</div></div>
              <div class="item-price">$13.00</div>
            </div>
          </div>
          <div class="checkout-box">
            <div class="subtotal-row"><span>Subtotal</span><span>$80.00</span></div>
            <div class="subtotal-row"><span>Courier Fee</span><span>$4.50</span></div>
            <div class="subtotal-row"><span>Sales Tax</span><span>$6.80</span></div>
            <div class="total-row"><span>Total</span><span>$91.30</span></div>
            <button class="checkout-btn">Pay with Apple Pay / Card</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: path.join(outDir, 'madinabites.webp'), quality: 95 });
  console.log('Generated madinabites.webp');

  // 3. AgenticArmor Framework
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1600px;
          height: 1200px;
          background: #050B14;
          color: #E2E8F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .window-bar {
          height: 48px;
          background: #02060D;
          border-bottom: 1px solid #1E293B;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
        }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #EF4444; }
        .dot-y { background: #F59E0B; }
        .dot-g { background: #10B981; }
        .address-bar {
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          background: #0A1120;
          border: 1px solid #1E293B;
          border-radius: 8px;
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          font-size: 13px;
          color: #94A3B8;
          font-family: monospace;
        }
        .app-body {
          flex: 1;
          display: flex;
          padding: 32px 40px;
          gap: 32px;
          background: radial-gradient(circle at 80% 20%, rgba(247, 68, 78, 0.08), transparent 500px);
        }
        .col-left {
          flex: 1.4;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .col-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .panel {
          background: #090F1D;
          border: 1px solid #1E293B;
          border-radius: 14px;
          padding: 24px;
        }
        .header-title { font-size: 28px; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 12px; }
        .shield-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(247, 68, 78, 0.15); border: 1px solid #F7444E; display: flex; align-items: center; justify-content: center; color: #F7444E; font-weight: 900; }
        .policy-matrix {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .policy-row {
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .policy-name { font-weight: 600; font-size: 14px; color: #F8FAFC; }
        .policy-scope { font-family: monospace; font-size: 12px; color: #78BCC4; }
        .action-tag { font-family: monospace; font-size: 11px; padding: 4px 8px; border-radius: 6px; font-weight: 700; }
        .tag-block { background: rgba(247, 68, 78, 0.2); color: #F7444E; border: 1px solid rgba(247, 68, 78, 0.4); }
        .tag-allow { background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .tag-audit { background: rgba(245, 158, 11, 0.2); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.4); }
        /* Log terminal */
        .terminal {
          flex: 1;
          background: #030712;
          border: 1px solid #1E293B;
          border-radius: 14px;
          padding: 20px;
          font-family: monospace;
          font-size: 12.5px;
          line-height: 1.6;
          color: #94A3B8;
          display: flex;
          flex-direction: column;
        }
        .term-title { color: #64748B; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid #1E293B; padding-bottom: 8px; }
        .term-line { margin-bottom: 6px; }
        .term-red { color: #F7444E; font-weight: bold; }
        .term-green { color: #34D399; font-weight: bold; }
        .term-teal { color: #78BCC4; }
      </style>
    </head>
    <body>
      <div class="window-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
        <div class="address-bar">https://gateway.agenticarmor.io/policies/live-intercept</div>
      </div>
      <div class="app-body">
        <div class="col-left">
          <div class="panel">
            <div class="header-title"><div class="shield-icon">🛡</div>AgenticArmor Policy Gateway</div>
            <p style="color: #64748B; font-size: 14px; margin-top: 6px;">Zero-Trust Token Scoping, Tool Action Verification & Runtime Sandbox Defense</p>
            <div class="policy-matrix">
              <div class="policy-row">
                <div><div class="policy-name">Shell Command Execution</div><div class="policy-scope">Scope: system.run_command</div></div>
                <span class="action-tag tag-block">BLOCKED (Privilege Breach)</span>
              </div>
              <div class="policy-row">
                <div><div class="policy-name">Vector Embedding Read</div><div class="policy-scope">Scope: db.vector.search(k=5)</div></div>
                <span class="action-tag tag-allow">AUTHORIZED (24ms)</span>
              </div>
              <div class="policy-row">
                <div><div class="policy-name">Database Write / Update</div><div class="policy-scope">Scope: postgres.schema.write</div></div>
                <span class="action-tag tag-audit">REQUIRES 2FA HUMAN SIGN</span>
              </div>
              <div class="policy-row">
                <div><div class="policy-name">Third-Party Webhook Call</div><div class="policy-scope">Scope: net.http.post(api.slack)</div></div>
                <span class="action-tag tag-allow">AUTHORIZED (Egress Safe)</span>
              </div>
            </div>
          </div>
          <div class="panel" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div><div style="font-size: 11px; color:#64748B; font-family: monospace;">ANOMALIES INTERCEPTED</div><div style="font-size: 24px; font-weight: 800; color: #F7444E; font-family: monospace;">14,920</div></div>
            <div><div style="font-size: 11px; color:#64748B; font-family: monospace;">POLICY LATENCY</div><div style="font-size: 24px; font-weight: 800; color: #78BCC4; font-family: monospace;">1.2 ms</div></div>
            <div><div style="font-size: 11px; color:#64748B; font-family: monospace;">ACTIVE AGENTS</div><div style="font-size: 24px; font-weight: 800; color: #34D399; font-family: monospace;">128 pods</div></div>
          </div>
        </div>
        <div class="col-right">
          <div class="terminal">
            <div class="term-title">Live Egress Audit Stream</div>
            <div class="term-line"><span class="term-teal">[12:44:02.191]</span> <span class="term-green">PASS</span> Agent-Alpha verified with JWT HMAC-SHA256</div>
            <div class="term-line"><span class="term-teal">[12:44:02.210]</span> <span class="term-green">INFO</span> Tool invoked: <span style="color:#FFF">rag_retrieve_context</span></div>
            <div class="term-line"><span class="term-teal">[12:44:02.840]</span> <span class="term-red">ALERT</span> Unauthorized credential probe intercepted: <span style="color:#FFF">/etc/passwd</span></div>
            <div class="term-line"><span class="term-teal">[12:44:02.841]</span> <span class="term-red">DROP</span> Sandbox boundary enforced (Rule #84-A)</div>
            <div class="term-line"><span class="term-teal">[12:44:03.002]</span> <span class="term-green">PASS</span> Token refresh issued for Agent-Bravo (TTL: 300s)</div>
            <div class="term-line"><span class="term-teal">[12:44:03.450]</span> <span class="term-green">INFO</span> Vector cosine similarity threshold: 0.925</div>
            <div class="term-line"><span class="term-teal">[12:44:03.910]</span> <span class="term-teal">SYNC</span> Gateway cluster synced across 3 geo-regions</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: path.join(outDir, 'agenticarmor.webp'), quality: 95 });
  console.log('Generated agenticarmor.webp');

  // 4. Prism Spatial Studio
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1600px;
          height: 1200px;
          background: #0B0F19;
          color: #E2E8F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .window-bar {
          height: 48px;
          background: #060911;
          border-bottom: 1px solid #1E293B;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
        }
        .dots { display: flex; gap: 8px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-r { background: #EF4444; }
        .dot-y { background: #F59E0B; }
        .dot-g { background: #10B981; }
        .address-bar {
          flex: 1;
          max-width: 600px;
          margin: 0 auto;
          background: #0D1322;
          border: 1px solid #1E293B;
          border-radius: 8px;
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          font-size: 13px;
          color: #94A3B8;
          font-family: monospace;
        }
        .studio-body {
          flex: 1;
          display: flex;
        }
        .left-nodes {
          width: 320px;
          background: #080D18;
          border-right: 1px solid #1E293B;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .node-box {
          background: #111A2E;
          border: 1px solid #1E293B;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .node-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #78BCC4; }
        .node-port { font-size: 11px; font-family: monospace; color: #64748B; }
        .viewport-3d {
          flex: 1;
          background: radial-gradient(circle at center, #131E35 0%, #080D18 80%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        /* Raymarched Torus Shape */
        .prism-torus {
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: conic-gradient(from 180deg at 50% 50%, #F7444E 0deg, #78BCC4 120deg, #002C3E 240deg, #F7444E 360deg);
          box-shadow: 0 0 100px rgba(120, 188, 196, 0.4), inset 0 0 60px rgba(0,0,0,0.8);
          position: relative;
          filter: blur(1px);
        }
        .prism-inner {
          position: absolute;
          inset: 90px;
          background: #0B0F19;
          border-radius: 50%;
          box-shadow: inset 0 0 40px rgba(247, 68, 78, 0.5);
        }
        .hud-stats {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(8, 13, 24, 0.8);
          border: 1px solid #1E293B;
          backdrop-filter: blur(8px);
          border-radius: 10px;
          padding: 14px 20px;
          font-family: monospace;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hud-val { color: #34D399; font-weight: 700; }
        .right-shader {
          width: 460px;
          background: #060911;
          border-left: 1px solid #1E293B;
          padding: 24px;
          font-family: monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #94A3B8;
        }
        .kw { color: #F7444E; font-weight: bold; }
        .fn { color: #78BCC4; }
        .num { color: #FBBF24; }
      </style>
    </head>
    <body>
      <div class="window-bar">
        <div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
        <div class="address-bar">https://prism.studio.internal/engine/sdf-raymarcher</div>
      </div>
      <div class="studio-body">
        <div class="left-nodes">
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 0.05em;">Graph Pipeline</div>
          <div class="node-box">
            <div class="node-header"><span>CameraRayGen</span><span>[IN]</span></div>
            <div class="node-port">→ ray.origin: vec3<br>→ ray.dir: normalize(uv)</div>
          </div>
          <div class="node-box" style="border-color: #78BCC4;">
            <div class="node-header"><span style="color:#FFF;">SDF_Torus_CSG</span><span>[OP]</span></div>
            <div class="node-port">→ radius: 2.45<br>→ thickness: 0.82<br>→ smooth_union: 0.15</div>
          </div>
          <div class="node-box">
            <div class="node-header"><span>PBR_BRDF_Shading</span><span>[OUT]</span></div>
            <div class="node-port">→ metallic: 0.95<br>→ roughness: 0.08<br>→ normal_eval: 6-tap</div>
          </div>
        </div>
        <div class="viewport-3d">
          <div class="hud-stats">
            <div>FRAME RATE: <span class="hud-val">120 FPS (8.3ms)</span></div>
            <div>DISPATCH: <span class="hud-val">1.4ms WebGPU</span></div>
            <div>RAYMARCH STEPS: <span style="color:#78BCC4; font-weight:700;">64 adaptive</span></div>
          </div>
          <div class="prism-torus">
            <div class="prism-inner"></div>
          </div>
        </div>
        <div class="right-shader">
          <div style="font-size: 11px; text-transform: uppercase; color: #64748B; margin-bottom: 14px; border-bottom: 1px solid #1E293B; padding-bottom: 8px;">WGSL Compute Shader</div>
          <div class="kw">@compute @workgroup_size</div>(<span class="num">16</span>, <span class="num">16</span>)<br>
          <span class="kw">fn</span> <span class="fn">cs_main</span>(@builtin(global_invocation_id) id: vec3&lt;u32&gt;) {<br>
          &nbsp;&nbsp;<span class="kw">let</span> uv = vec2&lt;f32&gt;(id.xy) / uniforms.res;<br>
          &nbsp;&nbsp;<span class="kw">var</span> ray = <span class="fn">generate_camera_ray</span>(uv);<br>
          &nbsp;&nbsp;<span class="kw">let</span> d = <span class="fn">march_scene_bvh</span>(ray, <span class="num">64</span>);<br>
          &nbsp;&nbsp;<span class="kw">if</span> (d &lt; <span class="num">0.001</span>) {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">let</span> n = <span class="fn">calc_normal</span>(ray.pos);<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">let</span> col = <span class="fn">pbr_metallic_roughness</span>(n, ray);<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">textureStore</span>(outputTex, id.xy, col);<br>
          &nbsp;&nbsp;}<br>
          }
        </div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: path.join(outDir, 'prism-studio.webp'), quality: 95 });
  console.log('Generated prism-studio.webp');

  await browser.close();
  console.log('All posters generated successfully!');
}

generatePosters().catch(console.error);

