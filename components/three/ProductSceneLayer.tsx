"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useProductScene, type StageId } from "@/lib/three/product-scene";
import { RolloverModel } from "@/components/three/RolloverModel";
import { SceneLights } from "@/components/three/SceneLights";

type StagePose = {
  /** World position target */
  position: [number, number, number];
  /** Model scale relative to stage size */
  scale: number;
  /** Camera look-at offset */
  look: [number, number, number];
};

/** Base poses in world space; final screen placement is adjusted per stage rect. */
const POSES: Record<StageId, StagePose> = {
  hero: { position: [0, 0, 0], scale: 1, look: [0, 0.02, 0] },
  buy: { position: [0, 0, 0], scale: 0.96, look: [0, 0.02, 0] },
  modes: { position: [0, 0, 0], scale: 0.92, look: [0, 0, 0] },
};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    const ext = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_lose_context",
    );
    ext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileLike(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    navigator.maxTouchPoints > 0
  );
}

/** Detect WebGL once at layer mount and write into context. */
function useWebglSupport() {
  const { setWebglOk } = useProductScene();
  useEffect(() => {
    setWebglOk(supportsWebGL());
  }, [setWebglOk]);
}

/**
 * Places the product so it sits centered in the active stage's screen rect.
 * One product instance for the whole page — never remounts between sections.
 */
function StageProduct() {
  const { activeStage } = useProductScene();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useMemo(prefersReducedMotion, []);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetScale = useRef(1);

  // Screen rect → world position on z=0 plane
  const updateTarget = () => {
    const stage = activeStage;
    const el = stage
      ? document.querySelector(`[data-product-stage="${stage}"]`)
      : null;
    if (!el) {
      targetPos.current.set(0, 0, 0);
      targetScale.current = 1;
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ndcX = (cx / window.innerWidth) * 2 - 1;
    const ndcY = -((cy / window.innerHeight) * 2 - 1);

    // Unproject onto z=0 plane
    const v = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const dir = v.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const world = camera.position.clone().add(dir.multiplyScalar(dist));
    targetPos.current.copy(world);

    // Scale from stage size (fit product ~72% of min dimension)
    const minDim = Math.min(rect.width, rect.height);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const worldH = 2 * Math.tan(fov / 2) * Math.abs(camera.position.z);
    const worldPerPx = worldH / window.innerHeight;
    const desired = (minDim * 0.72 * worldPerPx) / 2;
    const pose = stage ? POSES[stage] : POSES.hero;
    targetScale.current = Math.max(0.5, Math.min(2.0, desired)) * pose.scale;
  };

  useFrame((_, delta) => {
    updateTarget();
    const g = groupRef.current;
    if (!g) return;

    const damp = reduced ? 1 : 1 - Math.exp(-6 * delta);
    g.position.lerp(targetPos.current, damp);
    const s = THREE.MathUtils.damp(
      g.scale.x,
      targetScale.current,
      reduced ? 1 : 6,
      delta,
    );
    g.scale.setScalar(s);

    // Stage-aware yaw: show the top face (well + track) at a premium 3/4 angle.
    // Pitch stays ~0 — elevated camera already looks down onto the well.
    const stageYaw =
      activeStage === "hero"
        ? -0.5
        : activeStage === "buy"
          ? -0.75
          : activeStage === "modes"
            ? -1.0
            : -0.5;
    const stagePitch = 0.04;

    if (!reduced) {
      const scroll = window.scrollY / Math.max(1, document.body.scrollHeight);
      const scrollYaw = Math.sin(scroll * Math.PI * 2) * 0.06;
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        stageYaw + scrollYaw,
        4,
        delta,
      );
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, stagePitch, 4, delta);
    } else {
      g.rotation.x = stagePitch;
      g.rotation.y = stageYaw;
    }
  });

  // Soft backdrop glow plane behind product
  return (
    <group>
      <mesh position={[0, 0.1, -2.5]} renderOrder={-1}>
        <planeGeometry args={[10, 8]} />
        <meshBasicMaterial
          color="#f3ebe0"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      <group ref={groupRef}>
        <RolloverModel />
      </group>
      <CursorParallax reduced={reduced} />
    </group>
  );
}

function CursorParallax({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.02, 0), []);
  // Elevated 3/4 product-shot camera — top face readable, still dimensional
  const baseY = 2.35;
  const baseZ = 3.4;

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const tx = reduced ? 0 : mouse.current.x * 0.22;
    const ty = baseY + (reduced ? 0 : -mouse.current.y * 0.12);
    const damp = 1 - Math.exp(-4 * Math.min(delta, 0.1));
    camera.position.x += (tx - camera.position.x) * damp;
    camera.position.y += (ty - camera.position.y) * damp;
    camera.position.z = baseZ;
    camera.lookAt(lookTarget);
  });

  return null;
}

/** Stage order for scroll-driven activation (top → bottom of page). */
const STAGE_ORDER: StageId[] = ["hero", "buy", "modes"];

/**
 * Picks the stage whose center is closest to the viewport center
 * among those with meaningful visibility. More reliable than per-slot IOs
 * with sticky parents.
 */
function pickActiveStage(): StageId | null {
  const vh = window.innerHeight;
  const vc = vh * 0.42; // bias slightly above center — matches sticky frames
  let best: StageId | null = null;
  let bestDist = Infinity;

  for (const id of STAGE_ORDER) {
    const el = document.querySelector(`[data-product-stage="${id}"]`);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.height <= 0) continue;
    const visible = Math.max(
      0,
      Math.min(r.bottom, vh) - Math.max(r.top, 0),
    );
    const ratio = visible / r.height;
    if (ratio < 0.2) continue;
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - vc);
    // Prefer stages that cover the viewport center band
    const inBand = center >= 0 && center <= vh;
    const score = (inBand ? 0 : 1000) + dist;
    if (score < bestDist) {
      bestDist = score;
      best = id;
    }
  }
  return best;
}

/**
 * Fixed full-viewport R3F layer. Mounted once for the product journey.
 * Product stays mounted; only its placement/pose changes across stages.
 */
export function ProductSceneLayer() {
  const { webglOk, activeStage, setActiveStage } = useProductScene();
  const reduced = useMemo(prefersReducedMotion, []);
  const mobile = useMemo(isMobileLike, []);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  useWebglSupport();

  // Central stage activation + visibility (scroll / resize)
  useEffect(() => {
    const sync = () => {
      const stages = document.querySelectorAll("[data-product-stage]");
      let near = false;
      stages.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > -200 && r.top < window.innerHeight + 200) near = true;
      });
      setVisible(near);
      setActiveStage(pickActiveStage());
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [setActiveStage]);

  // Fade out when scrolled past the product journey (specs/CTA)
  useEffect(() => {
    const modes = document.querySelector('[data-product-stage="modes"]');
    if (!modes) return;
    const onScroll = () => {
      const r = modes.getBoundingClientRect();
      const past = r.bottom < -80;
      const el = wrapRef.current;
      if (el) {
        el.style.opacity = past ? "0" : visible ? "1" : "0";
        el.style.visibility = past ? "hidden" : "visible";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!webglOk) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        shadows={!mobile}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ fov: 32, position: [0, 2.35, 3.4], near: 0.1, far: 40 }}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <SceneLights reduced={reduced} />
        <StageProduct />
      </Canvas>
      <span className="sr-only">
        Interactive 3D view of ROLLOVER ONE. Product details are described in
        the surrounding text.
      </span>
    </div>
  );
}
