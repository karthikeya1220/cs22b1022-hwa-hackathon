"use client";

import { ProductVisual } from "@/components/product/ProductVisual";
import { Tilt } from "@/components/motion/Tilt";
import type { Finish } from "@/lib/product";

type Props = {
  finish: Finish;
  mode?: "idle" | "lick" | "roll" | "puzzle";
  className?: string;
  frameClassName?: string;
  tilt?: boolean;
  bare?: boolean;
};

/**
 * Shared presentation shell for the product across the page.
 * Same lighting frame, same object — only pose/finish change.
 */
export function ProductStage({
  finish,
  mode = "idle",
  className = "",
  frameClassName = "",
  tilt = false,
  bare = false,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-white/70 via-ivory to-sand/30 ${frameClassName}`}
    >
      {/* studio backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.9), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(212,196,168,0.45), transparent 50%)",
        }}
        aria-hidden
      />

      <Tilt enabled={tilt} max={5} scale={1.015} className="relative h-full">
        <ProductVisual
          finishHex={finish.hex}
          finishName={finish.name}
          mode={mode}
          bare={bare}
          className={className}
        />
      </Tilt>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_60px_rgba(28,26,23,0.06)]"
        aria-hidden
      />
    </div>
  );
}
