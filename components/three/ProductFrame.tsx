"use client";

import type { ReactNode } from "react";
import { ProductStageSlot } from "@/components/three/ProductStageSlot";
import { ProductVisual } from "@/components/product/ProductVisual";
import type { Finish } from "@/lib/product";
import type { ProductMode, StageId } from "@/lib/three/product-scene";
import { useProductScene } from "@/lib/three/product-scene";

type Props = {
  stage: StageId;
  finish: Finish;
  mode?: ProductMode;
  className?: string;
  frameClassName?: string;
  bare?: boolean;
  tilt?: boolean;
  children?: ReactNode;
};

/**
 * Shared product presentation shell.
 * WebGL: near-transparent window so the fixed canvas product shows through.
 * Fallback: original CSS product visual with the studio frame.
 */
export function ProductFrame({
  stage,
  finish,
  mode = "idle",
  className = "",
  frameClassName = "",
  bare = false,
  children,
}: Props) {
  const { webglOk } = useProductScene();

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-line ${
        webglOk
          ? "bg-white/20 shadow-[0_36px_70px_-40px_rgba(28,26,23,0.28)]"
          : "bg-gradient-to-br from-white/70 via-ivory to-sand/30"
      } ${frameClassName} ${className}`}
    >
      {/* faint edge light only — keeps the window open for the 3D product */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          background: webglOk
            ? "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(255,255,255,0.22), transparent 60%)"
            : "radial-gradient(ellipse 80% 60% at 50% 18%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 85%, rgba(212,196,168,0.25), transparent 50%)",
          opacity: webglOk ? 1 : 0.5,
        }}
        aria-hidden
      />

      <ProductStageSlot
        id={stage}
        fallback={
          <ProductVisual
            finishHex={finish.hex}
            finishName={finish.name}
            mode={mode}
            bare={bare}
            className="h-full w-full"
          />
        }
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_60px_rgba(28,26,23,0.06)]"
        aria-hidden
      />

      {children}
    </div>
  );
}
