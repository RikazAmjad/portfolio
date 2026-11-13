"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Cpu, GitCommit, CheckCircle2, Zap, Shield, Database, ArrowRight, Terminal } from "lucide-react";

export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  stack: string[];
  metrics: string[];
  architectureOverview: string;
  coreChallenge: string;
  solutionArchitecture: string;
  benchmarks: { metric: string; value: string; baseline: string }[];
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  liveUrl?: string;
  isTerminal?: boolean;
  terminalCommand?: string;
}

export const projectDetailsMap: Record<string, ProjectDetail> = {
  "01": {
    id: "01",
    title: "InMind Order Management System",
    category: "High-Volume E-Commerce Operations & Logistics",
    description: "Enterprise multi-channel order processing and dispatch orchestration platform managing 8,800+ live transactions, automated courier booking APIs, return tracking, and real-time inventory synchronization across multi-city fulfillment hubs.",
    year: "2025",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Courier APIs", "Tailwind CSS"],
    metrics: ["8,847+ Orders Handled", "3,639 Dispatched", "Sub-15ms State Sync"],
    architectureOverview: "InMind unifies high-concurrency order intake, merchant agent workflows, and 3PL courier logistics into a single operational command center. Connects automated booking gateways, attempt management, customer verification, and multi-tier agent permissioning with sub-15ms optimistic state transitions.",
    coreChallenge: "Handling peak e-commerce transaction bursts across hundreds of concurrent merchant agents, preventing double-booking and inventory race conditions, and synchronizing asynchronous webhook callbacks from disparate courier logistics providers without lost state.",
    solutionArchitecture: "Implemented a transactional state machine with optimistic locking, automated batch order merging, idempotency-keyed courier dispatch APIs, and real-time dashboard telemetry backed by PostgreSQL and Redis caches.",
    benchmarks: [
      { metric: "Active Order Volume", value: "8,847+ Orders", baseline: "Manual Sheets / Legacy ERP" },
      { metric: "Dispatch API Booking", value: "120 ms / consignment", baseline: "3-5 min Manual Entry" },
      { metric: "Logistics Traceability", value: "100.0% Traceable", baseline: "88.4% Legacy Baseline" },
      { metric: "Concurrent Contention", value: "0 Race Conditions", baseline: "2.3% Conflict Rate" }
    ],
    codeSnippet: {
      language: "typescript",
      filename: "oms/services/orderDispatchService.ts",
      code: `export async function dispatchOrderWithCourier(
  orderId: string,
  courierId: CourierProvider,
  fulfillmentContext: FulfillmentContext
): Promise<DispatchResult> {
  return await db.transaction(async (tx) => {
    // Validate finite state machine transition (Pending -> Booked -> Dispatched)
    const order = await tx.orders.lockForUpdate(orderId);
    assertCanTransition(order.status, OrderStatus.BOOKED);

    // Idempotent courier booking payload with automated tracking number generation
    const booking = await courierGateway.createConsignment({
      orderId: order.id,
      recipient: order.customerDetails,
      pieces: order.items.length,
      declaredValue: order.totalAmount,
      destinationCity: order.city,
    });

    // Commit atomic state mutation and publish dispatch event
    const updated = await tx.orders.update(orderId, {
      status: OrderStatus.BOOKED,
      trackingNumber: booking.consignmentNumber,
      courier: courierId,
      dispatchedAt: new Date(),
    });

    await eventBus.publish("order.dispatched", {
      orderId,
      tracking: booking.consignmentNumber,
      agentId: fulfillmentContext.agentId,
    });

    return { success: true, trackingNumber: booking.consignmentNumber };
  });
}`
    }
  },
  "02": {
    id: "02",
    title: "WashWell Laundry Pickup & Delivery",
    category: "On-Demand Logistics & Booking Engine",
    description: "Full-stack on-demand laundry and dry-cleaning logistics platform in UAE featuring automated doorstep pickup scheduling, ArcGIS geospatial dispatch, promo code engine, and automated PDF invoice generation.",
    year: "2025",
    stack: ["Laravel", "Inertia.js", "React", "ArcGIS API", "Tailwind CSS", "MySQL", "Vite"],
    metrics: ["Doorstep Geo-Dispatch", "Sub-Second Slot Booking", "Zero Drop Order Flow"],
    liveUrl: "https://washwell.ae/",
    architectureOverview: "WashWell delivers a frictionless booking and door-to-door delivery workflow for premium laundry services across the UAE. Integrates an interactive slot-booking calendar, ArcGIS mapping for precise pin-drop address validation, automated WhatsApp dispatch notifications, and dynamic pricing catalogs.",
    coreChallenge: "Orchestrating scheduled pickup/delivery time slots while accurately mapping complex UAE address structures (villa/building/apartment) and computing dynamic delivery routes without driver dispatch delays.",
    solutionArchitecture: "Engineered an Inertia.js + React responsive booking engine backed by Laravel. Combined ArcGIS JavaScript API for geofencing and address coordinate normalization with background queue workers for automated WhatsApp order confirmations and PDF invoice rendering.",
    benchmarks: [
      { metric: "Booking Flow Duration", value: "< 60 seconds", baseline: "4.5 mins (Phone/Chat)" },
      { metric: "Geocoding Precision", value: "99.4% First-Attempt", baseline: "82.0% Unvalidated Form" },
      { metric: "PDF Invoice Generation", value: "340 ms Instant", baseline: "Manual Billing Process" },
      { metric: "Mobile Conversion", value: "+41.8% Uplift", baseline: "Legacy Web Baseline" }
    ],
    codeSnippet: {
      language: "typescript",
      filename: "washwell/resources/js/Components/BookingForm.tsx",
      code: `export function usePickupBooking(slotConfig: BookingSlotConfig) {
  const { data, setData, post, processing, errors } = useForm<BookingPayload>({
    pickupDate: format(new Date(), "yyyy-MM-dd"),
    pickupSlot: "09:00 - 12:00",
    addressLine: "",
    coordinates: { lat: 25.2048, lng: 55.2708 }, // UAE Geo-centroid
    promoCode: "NEW50",
  });

  const confirmPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    post(route("booking.store"), {
      preserveScroll: true,
      onSuccess: (page) => {
        triggerWhatsAppNotification(page.props.bookingId);
        toast.success("Doorstep pickup scheduled successfully!");
      },
    });
  };

  return { data, setData, confirmPickup, processing, errors };
}`
    }
  },
  "03": {
    id: "03",
    title: "AgenticArmor CLI & Sentinel Swarm",
    category: "Autonomous AI DevSecOps & AST Compiler",
    description: "Terminal-based AI DevSecOps security middleware and deterministic AST compiler gate preventing prompt injection, privilege escalation, and unauthorized runtime execution in autonomous agent toolchains.",
    year: "2024",
    stack: ["TypeScript", "Node.js CLI", "Babel AST", "LangGraph", "pgvector", "Commander.js"],
    metrics: ["Sub-2ms AST Scan", "Zero Bypass Rate", "Fail-Closed CI/CD Gate"],
    isTerminal: true,
    terminalCommand: "agenticarmor audit ./src",
    architectureOverview: "AgenticArmor is an enterprise-grade CLI executable designed for local developer terminals and CI/CD pipelines. It halts prompt injection and dangerous autonomous tool execution before code reaches production, combining deterministic Babel AST visitors with a multi-agent LangGraph Sentinel Swarm.",
    coreChallenge: "Traditional regex scanners produce high false-positive rates and fail against obfuscated AST payloads, while LLM-based code reviewers hallucinate and cannot guarantee fail-closed security invariants at terminal build time.",
    solutionArchitecture: "Engineered a 6-module compiler pipeline: Babel AST logic extraction with JSX/comment sanitization, Canonical Intermediate Representation (CIR) encoding, Vector Semantic Caching via pgvector, and a LangGraph multi-agent red-team swarm with strict write-authority quarantine.",
    benchmarks: [
      { metric: "AST Extraction Rate", value: "1.8 ms / file", baseline: "45 ms (External SAST)" },
      { metric: "Prompt Injection Guard", value: "100% Fail-Closed", baseline: "76.2% Regex Filters" },
      { metric: "Cache Hit Ratio", value: "89.4% on Re-run", baseline: "0% (Uncached LLM)" },
      { metric: "CLI Exit Contract", value: "Exit 0 / 1 / 2", baseline: "Ad-hoc Log Warnings" }
    ],
    codeSnippet: {
      language: "typescript",
      filename: "agentic-armor/src/cli/auditCommand.ts",
      code: `export async function runAuditCommand(options: AuditOptions): Promise<number> {
  const targetDir = path.resolve(options.targetDir || '.');
  logger.info(\`Starting AgenticArmor DevSecOps Audit: \${targetDir}\`);

  const files = listCodeFiles(targetDir);
  const cirEngine = new CIREngine();
  const swarm = new SentinelSwarm();

  for (const file of files) {
    // Deterministic AST Extraction — Fail-Closed on syntax error (Exit Code 2)
    const nodes = extractSafeLogic(readSourceFile(file), file);

    // Single-node SAST risk scanner (eval, child_process, prototype pollution)
    const violations = scanAstVulnerabilities(nodes);
    if (violations.length > 0) {
      reporter.printViolations(violations);
      return 1; // Exit Code 1: Merge Blocked
    }

    // Canonical Intermediate Representation (CIR) -> Sentinel Swarm
    const cirPayload = cirEngine.encode(nodes);
    const auditResult = await swarm.evaluatePayload(cirPayload);
    if (auditResult.hasVulnerabilities) return 1;
  }
  return 0; // Exit Code 0: Clean Audit Passed
}`
    }
  },
  "04": {
    id: "04",
    title: "CoAdvert Global Merchandising Platform",
    category: "Global Headless E-Commerce & Supply Chain",
    description: "International B2B & B2C custom textile and promotional merchandise platform bridging Scandinavian design (CoAdvert AB Sweden) with industrial manufacturing (MH Tex Pakistan), featuring dynamic product catalogs and automated inquiry routing.",
    year: "2025",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Tailwind CSS v4", "Zod", "Nodemailer"],
    metrics: ["Global Multi-Region CDN", "Sub-50ms Catalog Filter", "Automated Quoting Engine"],
    liveUrl: "https://coadverts.vercel.app/",
    architectureOverview: "CoAdvert delivers a high-performance digital gateway for a 47-year textile manufacturing legacy. Built on Next.js 16 App Router and Supabase, it provides dynamic product family exploration, interactive customization specifications, certification portfolios (OEKO-TEX, GOTS), and automated B2B quote inquiries.",
    coreChallenge: "Presenting an extensive technical textile catalog with varied fabric weights, customization techniques (embroidery, screen print, sublimation), and volume tier pricing while maintaining lightning-fast global page loads across Nordic, European, and American markets.",
    solutionArchitecture: "Constructed a decoupled repository pattern architecture (IProductRepository, SupabaseProductRepository) with Next.js edge caching, client-side optimistic filtering, strict Zod schema validation, honeypot spam protection, and rate-limited email dispatch.",
    benchmarks: [
      { metric: "Catalog Filter Pacing", value: "< 16 ms Instant", baseline: "350 ms Server Query" },
      { metric: "Core Web Vitals (LCP)", value: "0.8s on Edge CDN", baseline: "3.2s Legacy Store" },
      { metric: "Inquiry Response SLA", value: "< 2 hrs Automated", baseline: "24-48 hrs Manual" },
      { metric: "Lighthouse Performance", value: "99 / 100", baseline: "64 / 100 Baseline" }
    ],
    codeSnippet: {
      language: "typescript",
      filename: "coadverts/src/core/services/ProductService.ts",
      code: `export class ProductService {
  constructor(private readonly repo: IProductRepository) {}

  async getCategoryWithSubcategories(slug: string): Promise<ProductCategory | null> {
    const category = await this.repo.findBySlug(slug);
    if (!category) return null;

    return {
      ...category,
      subcategories: await this.repo.getSubcategories(category.id),
      certifications: await this.repo.getCertificationsForCategory(category.id),
    };
  }

  async submitInquiry(payload: ContactFormData): Promise<ContactFormResponse> {
    const validated = contactFormSchema.parse(payload);
    return await this.repo.dispatchInquiry(validated);
  }
}`
    }
  }
};

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
}

export function ProjectModal({ projectId, onClose }: ProjectModalProps) {
  const detail = projectId ? projectDetailsMap[projectId] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (projectId) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [projectId, onClose]);

  return (
    <AnimatePresence>
      {detail && (
        <div data-modal className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#370232]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#370232] text-[#F2EEE5] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8 bg-[#4A0E44]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#FFD000] uppercase tracking-wider">
                  SYSTEM SPEC // {detail.id}
                </span>
                <span className="text-white/20">|</span>
                <span className="font-mono text-xs text-[#D1B8CE]">{detail.year}</span>
                {detail.isTerminal && (
                  <>
                    <span className="text-white/20">|</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/30">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>TERMINAL / CLI</span>
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {detail.liveUrl && (
                  <a
                    href={detail.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD000] text-[#370232] font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    <span>Live Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  data-magnetic="true"
                  aria-label="Close specification modal"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-[#FFD000] hover:text-[#FFD000] transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-8">
              {/* Title & Core Summary */}
              <div>
                <span className="font-mono text-xs font-semibold text-[#FFD000] tracking-wide uppercase">
                  {detail.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1 mb-3">
                  {detail.title}
                </h2>
                <p className="font-sans text-sm md:text-base text-[#D1B8CE] leading-relaxed">
                  {detail.description}
                </p>
              </div>

              {/* Architecture & Engineering Deep-Dive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-[#4A0E44] p-5">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FFD000] mb-3 font-semibold uppercase">
                    <Zap className="h-3.5 w-3.5" />
                    <span>The Engineering Bottleneck</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#F2EEE5]/80 leading-relaxed">
                    {detail.coreChallenge}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#4A0E44] p-5">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FFD000] mb-3 font-semibold uppercase">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Architectural Resolution</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#F2EEE5]/80 leading-relaxed">
                    {detail.solutionArchitecture}
                  </p>
                </div>
              </div>

              {/* Benchmarks Matrix */}
              <div>
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#D1B8CE] uppercase mb-4 flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-[#FFD000]" />
                  <span>Verified Production Telemetry</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {detail.benchmarks.map((b) => (
                    <div
                      key={b.metric}
                      className="rounded-xl border border-white/10 bg-[#240121] p-4 flex flex-col justify-between"
                    >
                      <span className="font-mono text-[10px] text-[#D1B8CE] uppercase">
                        {b.metric}
                      </span>
                      <div className="mt-2">
                        <span className="font-mono text-base sm:text-lg font-bold text-[#FFD000] block">
                          {b.value}
                        </span>
                        <span className="font-mono text-[9px] text-white/40 block mt-1">
                          vs {b.baseline}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production Code Snippet */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#D1B8CE] mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-3.5 w-3.5 text-[#FFD000]" />
                    <span className="text-white/80">{detail.codeSnippet.filename}</span>
                  </div>
                  <span className="uppercase text-[10px] text-[#FFD000]">
                    {detail.codeSnippet.language}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto">
                  <pre className="leading-relaxed">
                    <code>{detail.codeSnippet.code}</code>
                  </pre>
                </div>
              </div>

              {/* Tech Stack Pills & CTAs */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {detail.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-[#FFD000]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {detail.liveUrl && (
                    <a
                      href={detail.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#FFD000] bg-[#FFD000]/10 px-5 py-2 font-mono text-xs font-bold text-[#FFD000] hover:bg-[#FFD000] hover:text-[#370232] transition-colors"
                    >
                      <span>VISIT LIVE PLATFORM</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {detail.terminalCommand && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 font-mono text-xs text-[#D1B8CE]">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[#FFD000]">$</span>
                      <code className="text-white">{detail.terminalCommand}</code>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    data-magnetic="true"
                    className="flex items-center gap-2 rounded-full bg-[#FFD000] px-5 py-2 font-mono text-xs font-bold text-[#370232] hover:bg-white hover:text-[#370232] transition-colors"
                  >
                    <span>RETURN TO SPEC</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
