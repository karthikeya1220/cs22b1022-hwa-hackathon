"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useProductScene, type ProductMode } from "@/lib/three/product-scene";
import { getFinish, PRODUCT } from "@/lib/product";

const FINISH_HEX: Record<string, string> = {
  clay: "#c45c3e",
  sage: "#8a9a7b",
  charcoal: "#2e2b26",
};

const WELL_HEX = "#f3ede3";
const WELL_EDGE_HEX = "#e8e0d4";
const TREAT_HEX = "#c4a06a";
const TREAT_LIGHT_HEX = "#e8c9a0";
const PAD_HEX = "#e7ddd0";

function hexToRgb(hex: string) {
  const c = new THREE.Color(hex);
  return { r: c.r, g: c.g, b: c.b };
}

/**
 * Build a premium disc body profile (lathe around Y).
 * Radii are normalized so outer radius = 1.
 * Proportions follow the established ROLLOVER ONE design.
 */
function buildBodyProfile(): THREE.Vector2[] {
  const R = 1;
  const wellR = 0.66;
  const wellFloorY = 0.048;
  const topY = 0.1;
  const trackR = 0.52;
  const trackHalf = 0.038;
  const trackDepth = 0.02;
  const pts: THREE.Vector2[] = [];

  // Bottom center → weighted base
  pts.push(new THREE.Vector2(0, -0.1));
  pts.push(new THREE.Vector2(0.2, -0.1));
  pts.push(new THREE.Vector2(0.55, -0.099));
  pts.push(new THREE.Vector2(0.78, -0.096));

  // Bottom edge fillet → side wall
  pts.push(new THREE.Vector2(0.9, -0.088));
  pts.push(new THREE.Vector2(0.96, -0.07));
  pts.push(new THREE.Vector2(0.99, -0.045));
  pts.push(new THREE.Vector2(R, -0.02));
  pts.push(new THREE.Vector2(R, 0.0));
  pts.push(new THREE.Vector2(R, 0.025));

  // Top edge fillet → top face
  pts.push(new THREE.Vector2(0.99, 0.055));
  pts.push(new THREE.Vector2(0.96, 0.078));
  pts.push(new THREE.Vector2(0.9, 0.093));
  pts.push(new THREE.Vector2(0.82, 0.098));
  pts.push(new THREE.Vector2(0.72, topY));

  // Treat-track groove (circular)
  pts.push(new THREE.Vector2(trackR + trackHalf + 0.02, topY));
  pts.push(new THREE.Vector2(trackR + trackHalf, topY));
  pts.push(new THREE.Vector2(trackR + trackHalf, topY - trackDepth));
  pts.push(new THREE.Vector2(trackR, topY - trackDepth - 0.004));
  pts.push(new THREE.Vector2(trackR - trackHalf, topY - trackDepth));
  pts.push(new THREE.Vector2(trackR - trackHalf, topY));
  pts.push(new THREE.Vector2(trackR - trackHalf - 0.02, topY));

  // Inner top face → well wall
  pts.push(new THREE.Vector2(wellR + 0.03, topY));
  pts.push(new THREE.Vector2(wellR + 0.008, topY - 0.004));
  pts.push(new THREE.Vector2(wellR, topY - 0.012));
  pts.push(new THREE.Vector2(wellR, wellFloorY + 0.02));
  pts.push(new THREE.Vector2(wellR - 0.012, wellFloorY + 0.004));
  pts.push(new THREE.Vector2(wellR - 0.04, wellFloorY));
  pts.push(new THREE.Vector2(wellR * 0.5, wellFloorY - 0.002));
  pts.push(new THREE.Vector2(0, wellFloorY - 0.003));

  return pts;
}

function Treat({
  position,
  scale = 1,
  visible,
  delay = 0,
  reduced,
}: {
  position: [number, number, number];
  scale?: number;
  visible: boolean;
  delay?: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: TREAT_HEX,
        roughness: 0.72,
        metalness: 0.02,
      }),
    [],
  );
  const target = useRef(visible ? 1 : 0);

  useEffect(() => {
    target.current = visible ? 1 : 0;
  }, [visible]);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const t = target.current;
    const next = THREE.MathUtils.damp(m.scale.x, t, 8, delta);
    const s = next * scale;
    m.scale.setScalar(Math.max(0.0001, s));
    m.visible = next > 0.02;
    if (!reduced && visible) {
      m.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * 2.2 + delay) * 0.006;
    }
  });

  return (
    <mesh ref={ref} position={position} material={mat} castShadow>
      <sphereGeometry args={[0.045, 24, 16]} />
    </mesh>
  );
}

function ModeCues({
  mode,
  reduced,
}: {
  mode: ProductMode;
  reduced: boolean;
}) {
  const lick = mode === "lick";
  const roll = mode === "roll";
  const puzzle = mode === "puzzle";

  const padMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PAD_HEX,
        roughness: 0.85,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const gateMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#5a4034",
        roughness: 0.4,
        metalness: 0.05,
        clearcoat: 0.3,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const tickMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a342e",
        roughness: 0.55,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const arcMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#2e2b26",
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  );

  const padRef = useRef<THREE.Mesh>(null);
  const gateRef = useRef<THREE.Mesh>(null);
  const ticksRef = useRef<THREE.Group>(null);
  const arcsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const damp = (cur: number, to: number) =>
      THREE.MathUtils.damp(cur, to, 7, delta);

    padMat.opacity = damp(padMat.opacity, lick ? 1 : 0);
    gateMat.opacity = damp(gateMat.opacity, puzzle ? 1 : 0);
    tickMat.opacity = damp(tickMat.opacity, puzzle ? 1 : 0);
    arcMat.opacity = damp(arcMat.opacity, roll ? 0.55 : 0);

    if (padRef.current) padRef.current.visible = padMat.opacity > 0.02;
    if (gateRef.current) gateRef.current.visible = gateMat.opacity > 0.02;
    if (ticksRef.current) ticksRef.current.visible = tickMat.opacity > 0.02;
    if (arcsRef.current) arcsRef.current.visible = arcMat.opacity > 0.02;
  });

  const treatY = 0.055;
  const trackR = 0.52;

  return (
    <group>
      {/* LICK — soft silicone pad in the well */}
      <mesh
        ref={padRef}
        position={[0, 0.056, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={padMat}
        receiveShadow
      >
        <circleGeometry args={[0.42, 48]} />
      </mesh>

      {/* LICK — treat morsels in the well */}
      <Treat
        position={[0.12, treatY, 0.08]}
        visible={lick}
        delay={0}
        reduced={reduced}
      />
      <Treat
        position={[-0.1, treatY, -0.06]}
        visible={lick}
        delay={1.4}
        reduced={reduced}
        scale={0.9}
      />
      <Treat
        position={[0.04, treatY, -0.14]}
        visible={lick}
        delay={2.6}
        reduced={reduced}
        scale={0.85}
      />

      {/* ROLL — kibble seated in the circular track */}
      {[0, 2.1, 4.2].map((a, i) => {
        const x = Math.cos(a) * trackR;
        const z = Math.sin(a) * trackR;
        return (
          <Treat
            key={`kibble-${i}`}
            position={[x, 0.088, z]}
            visible={roll}
            delay={i * 0.9}
            reduced={reduced}
            scale={0.95}
          />
        );
      })}

      {/* ROLL — subtle motion arcs beside the body */}
      <group ref={arcsRef} position={[0, 0.02, 0]}>
        {[
          { rot: 0.4, y: 0.05 },
          { rot: 0.55, y: -0.02 },
          { rot: 0.3, y: -0.08 },
        ].map((a, i) => (
          <mesh
            key={`arc-${i}`}
            position={[-1.18, a.y, (i - 1) * 0.12]}
            rotation={[0, 0, a.rot]}
            material={arcMat}
          >
            <boxGeometry args={[0.02, 0.16 - i * 0.03, 0.02]} />
          </mesh>
        ))}
      </group>

      {/* PUZZLE — treat gate across the track */}
      <mesh
        ref={gateRef}
        position={[0, 0.105, trackR * 0.15]}
        rotation={[0, 0, 0]}
        material={gateMat}
        castShadow
      >
        <boxGeometry args={[0.34, 0.03, 0.055]} />
      </mesh>

      {/* PUZZLE — blocked-path ticks on the gate side of the track */}
      <group ref={ticksRef}>
        {[0.35, 1.0, 1.65, 2.4, 3.1, 3.85, 4.6, 5.35].map((a, i) => {
          const x = Math.cos(a) * trackR;
          const z = Math.sin(a) * trackR;
          return (
            <mesh
              key={`tick-${i}`}
              position={[x, 0.096, z]}
              material={tickMat}
            >
              <sphereGeometry args={[0.018, 12, 10]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Body({
  finishId,
  mode,
  reduced,
}: {
  finishId: string;
  mode: ProductMode;
  reduced: boolean;
}) {
  const bodyRef = useRef<THREE.Group>(null);
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: FINISH_HEX[finishId] ?? FINISH_HEX.clay,
        roughness: 0.48,
        metalness: 0.04,
        clearcoat: 0.38,
        clearcoatRoughness: 0.42,
        reflectivity: 0.35,
      }),
    [],
  );
  const hubMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: FINISH_HEX[finishId] ?? FINISH_HEX.clay,
        roughness: 0.42,
        metalness: 0.05,
        clearcoat: 0.45,
        clearcoatRoughness: 0.35,
      }),
    [],
  );
  const wellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: WELL_HEX,
        roughness: 0.78,
        metalness: 0,
      }),
    [],
  );
  const wellRingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: WELL_EDGE_HEX,
        roughness: 0.7,
        metalness: 0,
      }),
    [],
  );
  const hubCapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#efe8db",
        roughness: 0.55,
        metalness: 0.02,
      }),
    [],
  );
  const rimTickMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f7f3ec",
        roughness: 0.5,
        metalness: 0.1,
      }),
    [],
  );

  // Smooth finish color transitions
  const targetColor = useMemo(
    () => new THREE.Color(FINISH_HEX[finishId] ?? FINISH_HEX.clay),
    [finishId],
  );

  useFrame((_, delta) => {
    bodyMat.color.lerp(targetColor, reduced ? 1 : 1 - Math.exp(-8 * delta));
    hubMat.color.copy(bodyMat.color);

    // Subtle mode pose — established product behaviour only
    const g = bodyRef.current;
    if (!g) return;
    const targetRotZ = mode === "roll" ? -0.18 : mode === "puzzle" ? 0.06 : 0;
    const targetY = mode === "roll" ? 0.03 : mode === "puzzle" ? 0.01 : 0;
    if (reduced) {
      g.rotation.z = targetRotZ;
      g.position.y = targetY;
    } else {
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRotZ, 5, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 5, delta);
    }
  });

  const profile = useMemo(() => buildBodyProfile(), []);

  return (
    <group ref={bodyRef}>
      {/* Main shell — single lathe for continuous premium surface */}
      <mesh material={bodyMat} castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
      </mesh>

      {/* Cream well floor (slightly proud of lathe floor for clean material break) */}
      <mesh
        position={[0, 0.0475, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={wellMat}
        receiveShadow
      >
        <circleGeometry args={[0.62, 64]} />
      </mesh>

      {/* Soft inner well ring */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={wellRingMat}
      >
        <ringGeometry args={[0.58, 0.63, 64]} />
      </mesh>

      {/* Centre hub — raised, finish-matched */}
      <mesh position={[0, 0.048, 0]} material={hubMat} castShadow>
        <cylinderGeometry args={[0.27, 0.29, 0.055, 64]} />
      </mesh>
      {/* Hub rounded cap */}
      <mesh position={[0, 0.078, 0]} material={hubMat} castShadow>
        <sphereGeometry args={[0.27, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Hub ivory detail */}
      <mesh position={[0, 0.076, 0]} material={hubCapMat}>
        <cylinderGeometry args={[0.09, 0.09, 0.012, 32]} />
      </mesh>

      {/* Mode tick marks on outer rim */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
        <mesh
          key={`rim-${i}`}
          position={[Math.cos(a) * 0.92, 0.1, Math.sin(a) * 0.92]}
          material={rimTickMat}
        >
          <sphereGeometry args={[0.022, 16, 12]} />
        </mesh>
      ))}

      <ModeCues mode={mode} reduced={reduced} />
    </group>
  );
}

function GroundShadow({ finishId }: { finishId: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    g.addColorStop(0, "rgba(28,26,23,0.42)");
    g.addColorStop(0.45, "rgba(28,26,23,0.18)");
    g.addColorStop(1, "rgba(28,26,23,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    });
  }, []);

  useEffect(() => () => mat.dispose(), [mat]);
  void finishId;

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.101, 0]} material={mat}>
      <planeGeometry args={[3.2, 3.2]} />
    </mesh>
  );
}

/**
 * Procedural ROLLOVER ONE — proportions and features match the
 * established product design. No fictional internals.
 */
export function RolloverModel() {
  const { finishId, mode } = useProductScene();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const root = useRef<THREE.Group>(null);
  const baseSpin = useRef(0);

  // Idle rotation only when motion is allowed
  useFrame((_, delta) => {
    if (reduced || !root.current) return;
    baseSpin.current += delta * 0.12;
    // Very subtle idle — product should feel physical, not like a turntable gimmick
    // Compensate parent yaw so the top face stays the hero angle
    root.current.rotation.y = Math.sin(baseSpin.current) * 0.1;
  });

  const finish = getFinish(finishId) ?? PRODUCT.finishes[0];

  return (
    <group ref={root} dispose={null}>
      <Body finishId={finish.id} mode={mode} reduced={reduced} />
      <GroundShadow finishId={finish.id} />
    </group>
  );
}
