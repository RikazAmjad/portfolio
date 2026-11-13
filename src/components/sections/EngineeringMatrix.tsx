"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Network, Terminal, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface MatrixCategory {
  category: string;
  badge: string;
  skills: { name: string; metric: string; context: string }[];
}

const matrixData: MatrixCategory[] = [
  {
    category: "Distributed Systems & Streaming",
    badge: "Core Backend",
    skills: [
      { name: "Rust / Tokio", metric: "<2ms P99 Latency", context: "Async networking, zero-copy serialization, high-concurrency protocols." },
      { name: "Apache Kafka / Redpanda", metric: "4.8M Events/Sec", context: "Partitioned streaming topology, consumer group balancing." },
      { name: "Go / gRPC", metric: "1.2M Req/Sec", context: "High-density microservices, protobuf contract verification." },
      { name: "PostgreSQL & ClickHouse", metric: "10B+ Records", context: "Analytical columnar storage, sharded write topologies." },
    ],
  },
  {
    category: "Creative Engineering & 3D Spatial",
    badge: "Frontend & WebGL",
    skills: [
      { name: "Three.js / WebGL / WebGPU", metric: "120 FPS Pacing", context: "Custom GLSL vertex/fragment shaders, instanced rendering, raymarching." },
      { name: "React 19 / Next.js App Router", metric: "100% Core Web Vitals", context: "Server Components, streaming SSR, predictive prefetching." },
      { name: "Motion for React & Lenis", metric: "60 FPS Fluid", context: "Complex scroll-linked timelines, spring physics, layout choreography." },
      { name: "Tailwind CSS Architecture", metric: "Zero CSS Bloat", context: "Fluid token dictionaries, high-contrast dark/light design systems." },
    ],
  },
  {
    category: "Cloud Infrastructure & Reliability",
    badge: "DevOps & Ops",
    skills: [
      { name: "Kubernetes & Docker", metric: "Multi-Region Cluster", context: "Helm orchestrations, automated pod autoscaling, zero-downtime rolling deploys." },
      { name: "Terraform / IaC", metric: "Immutable Infra", context: "Declarative AWS/GCP cloud topologies, VPC peering, least-privilege IAM." },
      { name: "Prometheus & Grafana", metric: "Full Observability", context: "Distributed tracing (OpenTelemetry), RED metrics alerting, SLO monitors." },
      { name: "CI/CD & GitHub Actions", metric: "<4m Deploy Pipeline", context: "Automated regression testing, deterministic build caching, container signing." },
    ],
  },
  {
    category: "Architectural Leadership & Practice",
    badge: "Engineering Lead",
    skills: [
      { name: "RFC System Proposals", metric: "Peer-Reviewed", context: "Clear architectural boundaries, tradeoffs documentation, ADR archives." },
      { name: "API & Protocol Design", metric: "Zero Breaking Changes", context: "Semantic versioning, backward-compatible protobuf and GraphQL schemas." },
      { name: "Performance Profiling", metric: "Flamegraph Audits", context: "CPU/memory allocation tracking, memory leak diagnostics, GPU profiling." },
      { name: "Team Mentorship", metric: "High Velocity", context: "Rigorous code reviews, pair programming, cross-functional engineering alignment." },
    ],
  },
];

function InteractiveNodeArena() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 40;

  const [positions, linesGeometry] = useMemo(() => {
    const coords: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      coords.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4
        )
      );
    }

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (coords[i].distanceTo(coords[j]) < 2.5) {
          linePoints.push(coords[i], coords[j]);
        }
      }
    }

    const geom = new THREE.BufferGeometry().setFromPoints(linePoints);
    return [coords, geom];
  }, [count]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      {positions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={idx % 3 === 0 ? "#FFD000" : idx % 3 === 1 ? "#370232" : "#744470"}
            emissive={idx % 3 === 0 ? "#FFD000" : "#744470"}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}

      {/* Interconnecting Circuit Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#FFD000" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

export function EngineeringMatrix() {
  const [viewMode, setViewMode] = useState<"telemetry" | "spatial">("telemetry");

  return (
    <section
      id="matrix"
      className="relative w-full bg-[#370232] text-[#F2EEE5] px-6 py-24 md:px-12 md:py-36 min-h-screen z-20"
    >
      <div className="mx-auto w-full max-w-[94rem]">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-[#D1B8CE] uppercase mb-3">
              <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
              <span>Technical Competencies</span>
              <span className="ml-2 text-white/40">(03)</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Engineering Matrix
            </h2>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur-md">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode("telemetry");
              }}
              data-magnetic="true"
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold transition-all ${
                viewMode === "telemetry"
                  ? "bg-[#FFD000] text-[#370232] shadow-md font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Telemetry Matrix</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setViewMode("spatial");
              }}
              data-magnetic="true"
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold transition-all ${
                viewMode === "spatial"
                  ? "bg-[#FFD000] text-[#370232] shadow-md font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>3D Spatial Arena</span>
            </button>
          </div>
        </div>

        {/* View Mode Switching Canvas */}
        <AnimatePresence mode="wait">
          {viewMode === "telemetry" ? (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {matrixData.map((cat, idx) => (
                <div
                  key={cat.category}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#4A0E44] p-6 shadow-sm hover:border-[#FFD000]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                      <span className="font-mono text-[10px] tracking-wider text-[#FFD000] uppercase">
                        {cat.badge}
                      </span>
                      <span className="font-mono text-[10px] text-white/40">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight mb-6">
                      {cat.category}
                    </h3>

                    <div className="flex flex-col gap-5">
                      {cat.skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col">
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="font-bold text-sm text-[#F2EEE5]">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#FFD000]">
                              {skill.metric}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-[#D1B8CE] leading-relaxed">
                            {skill.context}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-white/40 font-mono text-[10px]">
                    <CheckCircle2 className="h-3 w-3 text-[#FFD000]" />
                    <span>VERIFIED PRODUCTION PROFICIENCY</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="spatial"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="relative h-[650px] w-full rounded-3xl border border-white/15 bg-[#4A0E44] overflow-hidden"
            >
              <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2.5} color="#FFD000" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#744470" />
                <InteractiveNodeArena />
              </Canvas>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-xs text-[#D1B8CE] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  Interactive Node Graph — Drag to orbit topology
                </span>
                <span className="font-mono text-xs text-[#FFD000] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  40 Connected Vertices
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
