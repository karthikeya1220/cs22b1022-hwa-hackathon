"use client";

import type { Finish } from "@/lib/product";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  finishes: readonly Finish[];
  value: string;
  onChange: (id: string) => void;
};

export function FinishSelector({ finishes, value, onChange }: Props) {
  const reduced = useReducedMotion();

  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Finish —{" "}
        <span className="normal-case tracking-normal text-charcoal">
          {finishes.find((f) => f.id === value)?.name}
        </span>
      </legend>
      <div
        className="mt-3 flex flex-wrap gap-3"
        role="radiogroup"
        aria-label="Finish"
      >
        {finishes.map((f) => {
          const active = f.id === value;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(f.id)}
              onKeyDown={(e) => {
                const idx = finishes.findIndex((x) => x.id === value);
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  onChange(finishes[(idx + 1) % finishes.length].id);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  onChange(
                    finishes[(idx - 1 + finishes.length) % finishes.length].id,
                  );
                }
              }}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-full border px-4 py-2.5 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                active
                  ? "border-charcoal bg-white/80 shadow-[0_8px_24px_-16px_rgba(28,26,23,0.4)]"
                  : "border-line bg-transparent hover:-translate-y-0.5 hover:border-charcoal/40 hover:bg-white/50"
              }`}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-charcoal/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_6px_rgba(28,26,23,0.15)] transition-transform duration-300 group-hover:scale-105"
                style={{ background: f.hex }}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-charcoal">
                  {f.name}
                </span>
                <span className="block text-xs text-muted">
                  {f.description}
                </span>
              </span>
              <span
                className={`ml-1 h-3.5 w-3.5 rounded-full border transition-all duration-300 ${
                  active
                    ? "scale-100 border-charcoal bg-charcoal"
                    : "scale-90 border-line"
                }`}
                aria-hidden
              />
              {active && !reduced && (
                <motion.span
                  layoutId="finish-ring"
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-charcoal/15"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
