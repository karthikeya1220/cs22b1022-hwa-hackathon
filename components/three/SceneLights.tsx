"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Studio lighting for a premium soft-touch product.
 * Fully procedural — no external HDRI downloads.
 */
export function SceneLights({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight
        args={["#fff8ef", "#d4c4a8", 0.55]}
        position={[0, 4, 0]}
      />

      {/* Key — warm upper left */}
      <directionalLight
        position={[3.2, 5.5, 2.4]}
        intensity={reduced ? 1.6 : 1.85}
        color="#fff6ec"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />

      {/* Fill — cool right */}
      <directionalLight
        position={[-4, 2.5, 1.5]}
        intensity={0.55}
        color="#e8eef5"
      />

      {/* Rim — separates product from backdrop */}
      <directionalLight
        position={[-1.5, 3.5, -4]}
        intensity={0.85}
        color="#fff2e4"
      />

      {/* Soft bounce from below for grounded feel */}
      <directionalLight position={[0, -2, 1]} intensity={0.2} color="#e8dcc8" />

      <Environment resolution={128}>
        <Lightformer
          intensity={1.4}
          position={[0, 4, -3]}
          scale={[8, 3, 1]}
          color="#fffaf3"
        />
        <Lightformer
          intensity={0.7}
          position={[-4, 1, 2]}
          scale={[3, 6, 1]}
          color="#eef3fa"
        />
        <Lightformer
          intensity={0.9}
          position={[4, 2, 1]}
          scale={[3, 5, 1]}
          color="#fff6ec"
        />
        <Lightformer
          intensity={0.35}
          position={[0, -3, 0]}
          scale={[6, 6, 1]}
          color="#d4c4a8"
        />
      </Environment>
    </>
  );
}
