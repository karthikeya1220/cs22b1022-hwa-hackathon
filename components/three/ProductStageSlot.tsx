"use client";

import { useRef, type ReactNode } from "react";
import { useProductScene, type StageId } from "@/lib/three/product-scene";

type Props = {
  id: StageId;
  children?: ReactNode;
  className?: string;
  /** CSS fallback shown when WebGL is unavailable */
  fallback?: ReactNode;
};

/**
 * Measuring anchor for the shared 3D scene.
 * WebGL: absolute fill of the parent frame — the fixed canvas draws the product.
 * No WebGL: relative block with the CSS product visual.
 * Stage activation is driven centrally by ProductSceneLayer (scroll picker).
 */
export function ProductStageSlot({
  id,
  children,
  className = "",
  fallback,
}: Props) {
  const { webglOk } = useProductScene();
  const ref = useRef<HTMLDivElement>(null);

  if (!webglOk) {
    return (
      <div
        ref={ref}
        data-product-stage={id}
        className={`relative h-full w-full min-h-[280px] ${className}`}
      >
        {fallback}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-product-stage={id}
      className={`absolute inset-0 ${className}`}
      aria-hidden
    >
      {children}
    </div>
  );
}
