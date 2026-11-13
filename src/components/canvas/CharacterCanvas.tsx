"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export type ProgressSource = {
  get(): number;
  on(event: "change", cb: (v: number) => void): () => void;
};

export type CharacterMode = "coffee" | "clean_tpose" | "animated" | "tripo";

export interface CharacterCanvasProps {
  initialMode?: CharacterMode;
  progressSource?: ProgressSource;
  className?: string;
  style?: React.CSSProperties;
}

// ── CHARACTER A: SIGNATURE DEVELOPER (With Coffee Cup & Screen-Plane Left-Right Wave) ──
function CharacterCoffeeModel({
  isReducedMotion = false,
  progressSource,
}: {
  isReducedMotion?: boolean;
  progressSource?: ProgressSource;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [bounce, setBounce] = useState(0);
  const isHovered = useRef(false);
  const waveIntensity = useRef(0);

  // Load the original model with coffee cup
  const { scene } = useGLTF("/character/character_tpose.glb");
  const waveUniform = useRef({ value: 0 });

  // Clone scene & inject GPU wrist/hand waving vertex shader (pure Left-Right screen plane)
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          const customMat = mat.clone();
          customMat.onBeforeCompile = (shader) => {
            shader.uniforms.uWaveAngle = waveUniform.current;
            shader.vertexShader = `
              uniform float uWaveAngle;
              ${shader.vertexShader}
            `;
            // Rotate normal in Z-Y plane so lighting updates accurately with wave motion
            shader.vertexShader = shader.vertexShader.replace(
              "#include <beginnormal_vertex>",
              `
              #include <beginnormal_vertex>
              if (position.y > 0.16 && position.z > 0.11) {
                float weight = smoothstep(0.16, 0.20, position.y);
                float angle = uWaveAngle * weight;
                float cosA = cos(angle);
                float sinA = sin(angle);
                objectNormal.zy = mat2(cosA, -sinA, sinA, cosA) * objectNormal.zy;
              }
              `
            );
            // Rotate wrist and hand in local Z-Y plane (maps directly to screen Left-Right World X-Y)
            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              `
              #include <begin_vertex>
              // Hand vertices isolated above wrist (y > 0.16, z > 0.11)
              if (position.y > 0.16 && position.z > 0.11) {
                float weight = smoothstep(0.16, 0.20, position.y);
                vec3 wristPivot = vec3(0.0455, 0.173, 0.162);
                vec3 p = transformed - wristPivot;
                float angle = uWaveAngle * weight;
                float cosA = cos(angle);
                float sinA = sin(angle);
                // Rotate in Z-Y plane: produces pure Left-Right waving across the screen plane
                p.zy = mat2(cosA, -sinA, sinA, cosA) * p.zy;
                transformed = p + wristPivot;
              }
              `
            );
          };
          (child as THREE.Mesh).material = customMat;
        }
      }
    });
    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.rotation.set(0, -Math.PI * 0.5, 0);
      groupRef.current.position.set(-0.15, -0.05, 0);
      waveUniform.current.value = 0;
      return;
    }

    // Fast, silky-smooth cursor interpolation (snappy response, no sluggish lag)
    const { pointer } = state;
    mouse.current.targetX = pointer.x * 0.28;
    mouse.current.targetY = pointer.y * 0.20;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 12, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 12, delta);

    // Smooth hover intensity transition
    const targetIntensity = isHovered.current ? 1.0 : 0.25;
    waveIntensity.current = THREE.MathUtils.damp(
      waveIntensity.current,
      targetIntensity,
      8,
      delta
    );

    // Natural idle breathing float
    const idleFloat = Math.sin(state.clock.elapsedTime * 2.0) * 0.012;
    const baseY = -0.05 + idleFloat;

    // Rock-solid front-facing orientation
    const baseFrontY = -Math.PI * 0.5;

    // Fluid hand waving: active wave on hover, subtle idle sway when resting
    const waveFreq = isHovered.current ? 7.0 : 2.4;
    const waveAmp = 0.36 * waveIntensity.current;
    let wristWave = Math.sin(state.clock.elapsedTime * waveFreq) * waveAmp;

    // Scroll-scrub wave addition: friendly left-right wave as user scrolls through manifesto
    const scrollVal = progressSource ? progressSource.get() : 0;
    if (scrollVal > 0.15) {
      const scrubPhase = (scrollVal - 0.15) / 0.70;
      wristWave += Math.sin(scrubPhase * Math.PI * 6.0) * 0.28;
    }

    // Interactive click bounce
    let posOffsetY = 0;
    if (bounce > 0) {
      posOffsetY += Math.sin(bounce * Math.PI * 2) * 0.05;
      wristWave += Math.sin(bounce * Math.PI * 6) * 0.35;
      setBounce((b) => Math.max(0, b - delta * 3));
    }

    waveUniform.current.value = wristWave;

    // Head and torso smoothly turn toward cursor
    groupRef.current.rotation.y = baseFrontY + mouse.current.x * 0.85;
    groupRef.current.rotation.x = -mouse.current.y * 0.55;
    groupRef.current.rotation.z = -mouse.current.x * 0.22;
    groupRef.current.position.y = baseY + posOffsetY;
  });

  const handleClick = () => {
    setBounce(1);
  };

  return (
    <group
      ref={groupRef}
      position={[-0.15, -0.05, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
      scale={[1.96, 1.96, 1.96]}
      onClick={handleClick}
      onPointerOver={() => {
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        isHovered.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={model} />
    </group>
  );
}

// ── CHARACTER B: NEW CLEAN SYMMETRICAL T-POSE (Without Coffee Cup, Empty Hands) ──
function CharacterCleanTPoseModel({ isReducedMotion = false }: { isReducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [bounce, setBounce] = useState(0);

  // Load the new clean T-pose model without coffee cup
  const { scene } = useGLTF("/character/character_tpose_clean.glb");

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.rotation.set(0, -Math.PI * 0.5, 0);
      groupRef.current.position.set(0, -0.05, 0);
      return;
    }

    const { pointer } = state;
    mouse.current.targetX = pointer.x * 0.28;
    mouse.current.targetY = pointer.y * 0.20;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 12, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 12, delta);

    const idleFloat = Math.sin(state.clock.elapsedTime * 2.0) * 0.012;
    let posOffsetY = idleFloat;
    if (bounce > 0) {
      posOffsetY += Math.sin(bounce * Math.PI * 2) * 0.05;
      setBounce((b) => Math.max(0, b - delta * 3));
    }

    // Natural front-facing rotation with cursor lookAt
    const baseFrontY = -Math.PI * 0.5;
    groupRef.current.rotation.y = baseFrontY + mouse.current.x * 0.85;
    groupRef.current.rotation.x = -mouse.current.y * 0.55;
    groupRef.current.rotation.z = -mouse.current.x * 0.22;
    groupRef.current.position.y = -0.05 + posOffsetY;
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.05, 0]}
      rotation={[0, -Math.PI * 0.5, 0]}
      scale={[1.96, 1.96, 1.96]}
      onClick={() => setBounce(1)}
    >
      <primitive object={model} />
    </group>
  );
}

// ── CHARACTER C: RIGGED SKELETAL ANIMATIONS (Mixamo GLB) ──
function CharacterAnimatedModel({ isReducedMotion = false }: { isReducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [bounce, setBounce] = useState(0);

  const gltf = useGLTF("/character/character_animated.glb");
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.4).play();
    }
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.4));
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.position.set(0, -0.05, 0);
      return;
    }

    const { pointer } = state;
    mouse.current.targetX = pointer.x * 0.22;
    mouse.current.targetY = pointer.y * 0.16;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 10, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 10, delta);

    const idleFloat = Math.sin(state.clock.elapsedTime * 2.0) * 0.01;
    let posOffsetY = idleFloat;
    if (bounce > 0) {
      posOffsetY += Math.sin(bounce * Math.PI * 2) * 0.05;
      setBounce((b) => Math.max(0, b - delta * 3));
    }

    groupRef.current.rotation.y = mouse.current.x * 0.65;
    groupRef.current.rotation.x = -mouse.current.y * 0.45;
    groupRef.current.position.y = -0.05 + posOffsetY;
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.05, 0]}
      scale={[1.96, 1.96, 1.96]}
      onClick={() => setBounce(1)}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

// ── CHARACTER D: TRIPO 3D PBR CHARACTER (Reclining Pose with Interactive Wave) ──
function CharacterTripoModel({
  isReducedMotion = false,
  progressSource,
}: {
  isReducedMotion?: boolean;
  progressSource?: ProgressSource;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [bounce, setBounce] = useState(0);
  const isHovered = useRef(false);
  const waveIntensity = useRef(0);

  const { scene } = useGLTF("/character/tripo_character.glb");
  const elbowUniform = useRef({ value: 0 });
  const wristUniform = useRef({ value: 0 });

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          const customMat = mat.clone();
          customMat.roughness = Math.max(mat.roughness, 0.72);
          customMat.metalness = 0.02;
          if (customMat.map) {
            customMat.map.anisotropy = 8;
          }

          // Forearm swings from the elbow, hand trails from the wrist (mesh is unrigged, so bend it on the GPU).
          // Arm box + pivots are measured from tripo_character.glb; re-measure if the model changes.
          customMat.onBeforeCompile = (shader) => {
            shader.uniforms.uElbow = elbowUniform.current;
            shader.uniforms.uWrist = wristUniform.current;
            shader.vertexShader = `
              uniform float uElbow;
              uniform float uWrist;
              vec3 armWave(vec3 v, vec3 pos, bool isPoint) {
                if (pos.y < 0.07 || pos.z < 0.04 || pos.z > 0.20 || pos.x < -0.13 || pos.x > 0.06) return v;
                vec3 wrist = isPoint ? vec3(0.0, 0.165, 0.112) : vec3(0.0);
                vec3 elbow = isPoint ? vec3(0.0, 0.075, 0.098) : vec3(0.0);
                float a = uWrist * smoothstep(0.165, 0.20, pos.y);
                v -= wrist;
                v.yz = mat2(cos(a), -sin(a), sin(a), cos(a)) * v.yz;
                v += wrist - elbow;
                a = uElbow * smoothstep(0.07, 0.11, pos.y);
                v.yz = mat2(cos(a), -sin(a), sin(a), cos(a)) * v.yz;
                return v + elbow;
              }
              ${shader.vertexShader}
            `;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
              objectNormal = armWave(objectNormal, position, false);`
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
              transformed = armWave(transformed, position, true);`
            );
          };
          (child as THREE.Mesh).material = customMat;
        }
      }
    });
    // Reclining pose: lying on floor, propped on elbow, head left, feet right, face forward
    cloned.rotation.set(0, -Math.PI * 0.5, 0);
    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      elbowUniform.current.value = 0;
      wristUniform.current.value = 0;
      return;
    }

    const { pointer } = state;
    // Gentle tracking so he gazes at user cursor
    mouse.current.targetX = pointer.x * 0.16;
    mouse.current.targetY = pointer.y * 0.12;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, mouse.current.targetX, 10, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, mouse.current.targetY, 10, delta);

    // Wave phase is the scroll position itself: scroll down waves forward, scroll up rewinds, stop = hand stops.
    const scrollVal = progressSource ? progressSource.get() : 0;
    const envelope = THREE.MathUtils.smoothstep(scrollVal, 0, 0.08) * (1 - THREE.MathUtils.smoothstep(scrollVal, 0.92, 1));
    let phase = scrollVal * Math.PI * 2 * 3; // 3 full waves across the manifesto
    let amount = envelope;

    // Hover / click still give a time-based wave on top
    waveIntensity.current = THREE.MathUtils.damp(waveIntensity.current, isHovered.current ? 1 : 0, 8, delta);
    if (bounce > 0) setBounce((b) => Math.max(0, b - delta * 3));
    const live = Math.max(waveIntensity.current, bounce);
    if (live > amount) {
      amount = live;
      phase = state.clock.elapsedTime * 7;
    }

    // Positive angle swings away from the head; wrist lags the forearm so the hand flops like a real wave
    const elbowTarget = amount * (0.18 + 0.46 * Math.sin(phase));
    const wristTarget = amount * 0.25 * Math.sin(phase - 0.9);
    elbowUniform.current.value = THREE.MathUtils.damp(elbowUniform.current.value, elbowTarget, 12, delta);
    wristUniform.current.value = THREE.MathUtils.damp(wristUniform.current.value, wristTarget, 12, delta);

    const idleFloat = Math.sin(state.clock.elapsedTime * 2.0) * 0.01;
    let posOffsetY = idleFloat;
    if (bounce > 0) {
      posOffsetY += Math.sin(bounce * Math.PI * 2) * 0.04;
    }

    // Interactive cursor follow and idle breathing
    groupRef.current.rotation.y = mouse.current.x * 0.35;
    groupRef.current.rotation.x = -mouse.current.y * 0.25;
    groupRef.current.rotation.z = -mouse.current.x * 0.06;
    groupRef.current.position.y = posOffsetY;
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      scale={[1.55, 1.55, 1.55]}
      onClick={() => setBounce(1)}
      onPointerOver={() => {
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        isHovered.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={model} />
    </group>
  );
}

// Preload models
useGLTF.preload("/character/tripo_character.glb");
useGLTF.preload("/character/character_tpose.glb");
useGLTF.preload("/character/character_tpose_clean.glb");

export default function CharacterCanvas({
  initialMode = "tripo",
  progressSource,
  className = "",
  style,
}: CharacterCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [currentMode, setCurrentMode] = useState<CharacterMode>(initialMode);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
        style={{ aspectRatio: "1.8 / 1", ...style }}
      >
        <div className="w-16 h-16 rounded-full border-2 border-[#370232]/20 border-t-[#370232] animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full select-none ${className}`}
      style={{
        aspectRatio: "1.8 / 1",
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.15], fov: 35 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
      >
        {/* Soft, neutral studio lighting matching the original 3D render */}
        <ambientLight intensity={1.1} color="#FFFFFF" />
        <directionalLight
          position={[1.5, 3.5, 3]}
          intensity={1.5}
          color="#FFFFFF"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        {/* Soft ambient wrap & bounce */}
        <directionalLight position={[-2.5, 1.5, 2]} intensity={0.7} color="#F7F5F0" />
        <directionalLight position={[0, -1, 2]} intensity={0.4} color="#EDE8DF" />

        <Suspense fallback={null}>
          {currentMode === "tripo" && (
            <CharacterTripoModel
              isReducedMotion={isReducedMotion}
              progressSource={progressSource}
            />
          )}
          {currentMode === "coffee" && (
            <CharacterCoffeeModel
              isReducedMotion={isReducedMotion}
              progressSource={progressSource}
            />
          )}
          {currentMode === "clean_tpose" && (
            <CharacterCleanTPoseModel isReducedMotion={isReducedMotion} />
          )}
          {currentMode === "animated" && (
            <CharacterAnimatedModel isReducedMotion={isReducedMotion} />
          )}

          {/* Ground Contact Shadow centered right beneath reclining body & elbow */}
          <ContactShadows
            position={[0, -0.44, 0]}
            opacity={0.46}
            scale={[2.5, 1.3]}
            blur={1.8}
            far={1.2}
            color="#370232"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
