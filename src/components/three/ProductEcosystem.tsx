"use client";

/**
 * Product Ecosystem — 3D orbital visualization.
 * Rahul at center, seven concept nodes in slow orbital motion on three rings.
 * Lazy-loaded via dynamic() in Hero.tsx — never SSR'd, never on mobile.
 *
 * Label occlusion: each label's opacity is driven every frame by a facing
 * calculation (dot product of camera direction × node world-position direction).
 * Labels fade out as a node moves to the far side of its orbit, preventing
 * mid-air collisions across rings.
 *
 * REPLACE THIS COMPONENT: swap geometry/materials for a refined asset later.
 * Data lives in src/content/hero.ts — do not hardcode here.
 */

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ecosystemNodes, orbitRings } from "@/content/hero";

type NodeConfig = (typeof ecosystemNodes)[number];
type RingConfig  = (typeof orbitRings)[number];

const C = {
  accent:    "#2B6BFF",
  text:      "#0A0A0B",
  textMuted: "#6B6B70",
  surface:   "#F1F0EC",
  border:    "#E6E5E0",
};

/* ─── Shared ring material (created once) ────────────────────────────────── */
const ringMaterial = new THREE.MeshBasicMaterial({
  color: C.border,
  transparent: true,
  opacity: 0.65,
});

/* ─── OrbitRing ──────────────────────────────────────────────────────────── */
function OrbitRing({ radius, inclination }: RingConfig) {
  // Torus default: XY plane. Rotate +π/2 around X → XZ (horizontal).
  // Then apply inclination to tilt the ring.
  return (
    <mesh rotation={[Math.PI / 2 + inclination, 0, 0]} material={ringMaterial}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
    </mesh>
  );
}

/* ─── CenterNode ─────────────────────────────────────────────────────────── */
function CenterNode() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mat = coreRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) {
      mat.emissiveIntensity = 0.18 + Math.sin(clock.elapsedTime * 1.3) * 0.06;
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.92, 32, 32]} />
        <meshStandardMaterial color={C.accent} transparent opacity={0.07} roughness={1} metalness={0} />
      </mesh>
      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color={C.accent} transparent opacity={0.13} roughness={1} metalness={0} />
      </mesh>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.44, 32, 32]} />
        <meshStandardMaterial
          color={C.accent} roughness={0.15} metalness={0.3}
          emissive={C.accent} emissiveIntensity={0.18}
        />
      </mesh>
      {/* Label */}
      <Html center position={[0, 0.68, 0]} style={{ pointerEvents: "none", userSelect: "none" }}>
        <span style={{
          fontSize: "9px",
          fontFamily: "var(--font-display, system-ui, sans-serif)",
          fontWeight: 600,
          color: C.text,
          whiteSpace: "nowrap",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: 0.45,
        }}>
          Rahul
        </span>
      </Html>
    </group>
  );
}

/* ─── OrbitalNode ────────────────────────────────────────────────────────── */
function OrbitalNode({ config }: { config: NodeConfig }) {
  const groupRef  = useRef<THREE.Group>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);

  // Stable scratch vectors — allocated once, mutated every frame.
  const worldPosV = useRef(new THREE.Vector3());
  const camDirV   = useRef(new THREE.Vector3());

  const baseOpacity = config.accent ? 0.95 : 0.78;
  const nodeR       = config.accent ? 0.17 : 0.125;

  useFrame(({ clock, camera }) => {
    if (!groupRef.current) return;

    // ── Position on orbit ────────────────────────────────────────────────
    const θ = clock.elapsedTime * config.speed + config.offset;
    const r = config.radius;
    const φ = config.inclination;
    groupRef.current.position.set(
      r * Math.cos(θ),
      r * Math.sin(θ) * Math.sin(φ),
      r * Math.sin(θ) * Math.cos(φ),
    );

    // ── Label facing-based opacity ───────────────────────────────────────
    // Measure how directly the node faces the camera in world space.
    // dot = 1  → node is on the camera side  → full opacity
    // dot = 0  → node is 90° from camera     → 50% opacity
    // dot < 0  → node is on the far side     → fade to 0
    if (labelRef.current) {
      groupRef.current.getWorldPosition(worldPosV.current);
      camDirV.current.copy(camera.position).normalize();
      worldPosV.current.normalize();
      const dot = camDirV.current.dot(worldPosV.current); // –1 … 1

      // Smooth ramp: invisible when dot ≤ 0, full at dot ≈ 0.5+
      const t = Math.max(0, dot * 2); // 0 → 0, 0.5 → 1, 1 → 2 (clamped below)
      const opacity = Math.min(baseOpacity, baseOpacity * t);
      labelRef.current.style.opacity = opacity.toFixed(3);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Accent halo */}
      {config.accent && (
        <mesh>
          <sphereGeometry args={[nodeR + 0.09, 16, 16]} />
          <meshStandardMaterial color={C.accent} transparent opacity={0.09} roughness={1} />
        </mesh>
      )}

      {/* Node sphere */}
      <mesh>
        <sphereGeometry args={[nodeR, 16, 16]} />
        <meshStandardMaterial
          color={config.accent ? C.accent : C.surface}
          roughness={0.3}
          metalness={config.accent ? 0.12 : 0.04}
          emissive={config.accent ? C.accent : "#000000"}
          emissiveIntensity={config.accent ? 0.08 : 0}
        />
      </mesh>

      {/* Label — opacity driven every frame via labelRef */}
      <Html center position={[0, nodeR + 0.2, 0]} style={{ pointerEvents: "none", userSelect: "none" }}>
        <span
          ref={labelRef}
          style={{
            fontSize: "10.5px",
            fontFamily: "var(--font-display, system-ui, sans-serif)",
            fontWeight: 500,
            color: config.accent ? C.accent : C.textMuted,
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
            opacity: 0, // starts hidden; facing calc sets it each frame
          }}
        >
          {config.label}
        </span>
      </Html>
    </group>
  );
}

/* ─── Scene (inside Canvas context) ─────────────────────────────────────── */
function EcosystemScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0024;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 6]}   intensity={1.3} />
      <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#dce8ff" />
      <pointLight position={[0, 0, 0]} color={C.accent} intensity={1.4} distance={6} decay={2} />

      {orbitRings.map((ring) => (
        <OrbitRing key={ring.radius} {...ring} />
      ))}

      <CenterNode />

      {ecosystemNodes.map((node) => (
        <OrbitalNode key={node.label} config={node} />
      ))}
    </group>
  );
}

/* ─── Canvas wrapper (exported as default for dynamic()) ─────────────────── */
export default function ProductEcosystem() {
  return (
    <Canvas
      camera={{ position: [0, 1.8, 8.0], fov: 55, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <EcosystemScene />
    </Canvas>
  );
}
