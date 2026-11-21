"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { EASE } from "@/components/motion/Reveal";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Subtle by default. */
  max?: number;
  /** Enable springy return + perspective. */
  enabled?: boolean;
  scale?: number;
};

/**
 * Subtle CSS 3D pointer tilt. Disabled under prefers-reduced-motion
 * and when `enabled` is false (e.g. mobile).
 */
export function Tilt({
  children,
  className,
  max = 6,
  enabled = true,
  scale = 1.01,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);

  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const srx = useSpring(rx, spring);
  const sry = useSpring(ry, spring);
  const ss = useSpring(s, spring);

  const active = enabled && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set((0.5 - py) * 2 * max);
    s.set(scale);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    s.set(1);
  };

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: ss,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      transition={{ ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
