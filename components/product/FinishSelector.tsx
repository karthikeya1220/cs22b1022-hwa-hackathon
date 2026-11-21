"use client";

import type { Finish } from "@/lib/product";

type Props = {
  finishes: readonly Finish[];
  value: string;
  onChange: (id: string) => void;
};

export function FinishSelector({ finishes, value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Finish
      </legend>
      <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Finish">
        {finishes.map((f) => {
          const active = f.id === value;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(f.id)}
              className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition ${
                active
                  ? "border-charcoal bg-white/70 shadow-[0_1px_0_rgba(28,26,23,0.06)]"
                  : "border-line bg-transparent hover:border-charcoal/40 hover:bg-white/40"
              }`}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full border border-charcoal/10"
                style={{ background: f.hex }}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-charcoal">
                  {f.name}
                </span>
                <span className="block text-xs text-muted">{f.description}</span>
              </span>
              <span
                className={`ml-1 h-3.5 w-3.5 rounded-full border ${
                  active ? "border-charcoal bg-charcoal" : "border-line"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
