"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface MonolithSceneProps {
  scrollProgress?: number;
}

function CrystallinePrism({ scrollProgress = 0 }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Custom faceted double-prism geometry
  const prismGeometry = useMemo(() => {
    return new THREE.OctahedronGeometry(1.6, 0);
  }, []);

  const innerCoreGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.85, 1);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth cursor interpolation
    const { pointer } = state;
    mouse.current.targetX = pointer.x * 0.45;
    mouse.current.targetY = pointer.y * 0.35;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 4, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 4, delta);

    // Continuous idle rotation plus mouse tilt
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x = mouse.current.y * 0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.rotation.z = -mouse.current.x * 0.5;

    // Inner core counter-rotation
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.6;
      coreRef.current.rotation.x -= delta * 0.3;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }

    // Scroll explosion factor: expands layers as user scrolls into Act II
    const explode = Math.min(Math.max((scrollProgress - 0.15) * 2.5, 0), 1.5);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, -explode * 1.8, 3, delta);
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, 1 + explode * 0.2, 3, delta));
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Outer Faceted Crystalline Shell */}
      <mesh geometry={prismGeometry}>
        <meshPhysicalMaterial
          color="#FFD000"
          emissive="#370232"
          emissiveIntensity={0.25}
          roughness={0.12}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.4}
          ior={1.75}
          wireframe={false}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Wireframe Structural Cage */}
      <mesh geometry={prismGeometry}>
        <meshBasicMaterial
          color="#FFD000"
          wireframe={true}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Radiant High-Energy Quantum Core */}
      <mesh ref={coreRef} geometry={innerCoreGeometry}>
        <meshStandardMaterial
          color="#370232"
          emissive="#FFD000"
          emissiveIntensity={1.8}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Quantum Circuit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 64]} />
        <meshBasicMaterial color="#FFD000" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 550;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const technicalTeal = new THREE.Color("#FFD000");
    const focalRed = new THREE.Color("#744470");
    const editorialWhite = new THREE.Color("#F2EEE5");

    for (let i = 0; i < count; i++) {
      // Spherical orbital distribution around the monolith
      const radius = 2.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.35 ? technicalTeal : Math.random() > 0.5 ? focalRed : editorialWhite;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y += delta * 0.08;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function MonolithCanvas({ scrollProgress = 0 }: MonolithSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={3.5} color="#FFD000" />
        <pointLight position={[-6, -4, -4]} intensity={2.0} color="#744470" />
        <directionalLight position={[0, 8, 3]} intensity={1.5} color="#F2EEE5" />

        <CrystallinePrism scrollProgress={scrollProgress} />
        <ParticleField />
      </Canvas>
      {/* Subtle radial vignetting to seamlessly integrate with dark canvas background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#370232_95%] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#370232] to-transparent pointer-events-none" />
    </div>
  );
}
