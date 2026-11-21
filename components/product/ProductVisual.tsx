type Props = {
  finishHex: string;
  finishName: string;
  /** Visual mode cue: how the disc is "posed" in the story. */
  mode?: "idle" | "lick" | "roll" | "puzzle";
  className?: string;
  /** Hide the caption strip (used when embedded in a larger stage). */
  bare?: boolean;
  /** Tiny thumbnail rendering (cart lines). */
  compact?: boolean;
};

/**
 * ROLLOVER ONE — pure CSS product render with layered depth,
 * lighting, and contact shadow. Shared across hero, buy box,
 * mode explorer, cart, and specs so the object stays continuous.
 *
 * Mode cues are always mounted and cross-fade via opacity —
 * the product never unmounts or disappears when modes change.
 */
export function ProductVisual({
  finishHex,
  finishName,
  mode = "idle",
  className = "",
  bare = false,
  compact = false,
}: Props) {
  const roll =
    mode === "roll" ? -14 : mode === "puzzle" ? 6 : mode === "lick" ? 0 : 0;
  const lift = mode === "roll" ? 8 : mode === "puzzle" ? 3 : 0;

  const cue = (on: boolean, delay = "0ms") => ({
    opacity: on ? 1 : 0,
    transition: `opacity 0.45s ease ${delay}`,
  });

  if (compact) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        role="img"
        aria-label={`ROLLOVER ONE in ${finishName}`}
      >
        <div
          className="relative"
          style={{
            transform: "perspective(600px) rotateX(14deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute left-1/2 top-full h-3 w-[80%] -translate-x-1/2 -translate-y-1/3 rounded-[50%] blur-[6px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(28,26,23,0.28), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative h-12 w-12 sm:h-14 sm:w-14">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${finishHex} 75%, black), color-mix(in srgb, ${finishHex} 50%, black))`,
                transform: "translateY(3px)",
                boxShadow: "0 6px 12px -4px rgba(28,26,23,0.4)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5), transparent 42%),
                  radial-gradient(circle at 50% 45%, color-mix(in srgb, ${finishHex} 88%, white) 0%, ${finishHex} 50%, color-mix(in srgb, ${finishHex} 60%, black) 100%)
                `,
                boxShadow: `
                  inset 0 1px 3px rgba(255,255,255,0.35),
                  inset 0 -4px 10px rgba(0,0,0,0.22),
                  0 10px 18px -8px rgba(28,26,23,0.4)
                `,
              }}
              aria-hidden
            />
            <div
              className="absolute inset-[22%] rounded-full"
              style={{
                background: `radial-gradient(circle at 40% 30%, #f7f3ec, #efe8db)`,
                boxShadow: "inset 0 4px 8px rgba(28,26,23,0.16)",
              }}
              aria-hidden
            />
            <div
              className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${finishHex} 85%, white), ${finishHex})`,
                boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.25)",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label={`ROLLOVER ONE in ${finishName}${mode !== "idle" ? ` — ${mode} mode` : ""}`}
    >
      {/* ambient stage glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 62%, color-mix(in srgb, ${finishHex} 22%, transparent), transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex h-full min-h-[340px] items-center justify-center px-6 pt-6 pb-16 sm:min-h-[460px] sm:pb-20">
        {/* object wrapper — slight perspective for depth */}
        <div
          className="relative"
          style={{
            transform: `perspective(1000px) rotateX(12deg) rotateZ(${roll}deg) translateY(-${lift}px)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* soft ground shadow — wider, deeper contact */}
          <div
            className="absolute left-1/2 top-full h-14 w-[95%] -translate-x-1/2 -translate-y-1/3 rounded-[50%] blur-2xl"
            style={{
              background: `radial-gradient(ellipse, rgba(28,26,23,${mode === "roll" ? 0.34 : 0.28}) 0%, rgba(28,26,23,0.12) 45%, transparent 72%)`,
              transition: "background 0.5s ease",
            }}
            aria-hidden
          />
          {/* secondary tight contact shadow */}
          <div
            className="absolute left-1/2 top-full h-5 w-[70%] -translate-x-1/2 -translate-y-1/4 rounded-[50%] blur-md"
            style={{
              background:
                "radial-gradient(ellipse, rgba(28,26,23,0.35), transparent 70%)",
            }}
            aria-hidden
          />

          {/* disc body */}
          <div className="relative h-56 w-56 sm:h-[21rem] sm:w-[21rem] md:h-[24rem] md:w-[24rem]">
            {/* side wall / thickness */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${finishHex} 75%, black) 0%, color-mix(in srgb, ${finishHex} 55%, black) 100%)`,
                transform: "translateY(12px)",
                boxShadow: "0 22px 42px -12px rgba(28,26,23,0.5)",
              }}
              aria-hidden
            />

            {/* top shell */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 32% 24%, rgba(255,255,255,0.58), transparent 42%),
                  radial-gradient(circle at 70% 78%, color-mix(in srgb, ${finishHex} 50%, black), transparent 50%),
                  radial-gradient(circle at 50% 45%, color-mix(in srgb, ${finishHex} 88%, white) 0%, ${finishHex} 48%, color-mix(in srgb, ${finishHex} 65%, black) 100%)
                `,
                boxShadow: `
                  inset 0 2px 6px rgba(255,255,255,0.35),
                  inset 0 -10px 24px rgba(0,0,0,0.22),
                  inset 0 0 0 1px color-mix(in srgb, ${finishHex} 40%, black),
                  0 32px 56px -22px rgba(28,26,23,0.45)
                `,
              }}
              aria-hidden
            />

            {/* specular arc */}
            <div
              className="absolute inset-[6%] rounded-full opacity-60"
              style={{
                background:
                  "conic-gradient(from 210deg, transparent 0deg, rgba(255,255,255,0.45) 50deg, transparent 110deg, transparent 360deg)",
                maskImage:
                  "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 10px))",
                WebkitMaskImage:
                  "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 10px))",
              }}
              aria-hidden
            />

            {/* recessed well */}
            <div
              className="absolute inset-[16%] rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 40% 30%, color-mix(in srgb, ${finishHex} 18%, #f7f3ec), #f3ede3 55%, color-mix(in srgb, ${finishHex} 12%, #e8e0d4) 100%)
                `,
                boxShadow: `
                  inset 0 12px 26px rgba(28,26,23,0.2),
                  inset 0 -3px 8px rgba(255,255,255,0.55),
                  0 1px 0 rgba(255,255,255,0.35)
                `,
                border: `1px solid color-mix(in srgb, ${finishHex} 22%, transparent)`,
              }}
              aria-hidden
            />

            {/* treat track groove */}
            <div
              className="absolute inset-[27%] rounded-full"
              style={{
                border: `3px solid color-mix(in srgb, ${finishHex} 45%, black)`,
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.18),
                  0 1px 0 rgba(255,255,255,0.3)
                `,
                opacity: mode === "puzzle" ? 1 : 0.75,
                outline:
                  mode === "puzzle"
                    ? `2px dashed color-mix(in srgb, ${finishHex} 70%, black)`
                    : "2px dashed transparent",
                outlineOffset: "6px",
                transition: "opacity 0.5s ease, outline-color 0.5s ease",
              }}
              aria-hidden
            />

            {/* LICK — soft silicone pad cue (always mounted, cross-fades) */}
            <div
              className="absolute inset-[30%] rounded-full"
              style={{
                background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${finishHex} 25%, white), color-mix(in srgb, ${finishHex} 12%, white))`,
                boxShadow: "inset 0 4px 12px rgba(28,26,23,0.12)",
                ...cue(mode === "lick"),
              }}
              aria-hidden
            />
            {/* LICK — treat morsels in the well */}
            {[
              { t: "32%", l: "42%" },
              { t: "48%", l: "56%" },
              { t: "58%", l: "38%" },
            ].map((p, i) => (
              <span
                key={`lick-treat-${i}`}
                className="absolute h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                style={{
                  top: p.t,
                  left: p.l,
                  background:
                    "radial-gradient(circle at 35% 30%, #e8c9a0, #c4a06a)",
                  boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.2)",
                  ...cue(mode === "lick", `${60 + i * 40}ms`),
                }}
                aria-hidden
              />
            ))}

            {/* center hub */}
            <div
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
              style={{
                background: `
                  radial-gradient(circle at 35% 30%, color-mix(in srgb, ${finishHex} 85%, white), ${finishHex} 55%, color-mix(in srgb, ${finishHex} 60%, black))
                `,
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.35),
                  inset 0 -6px 12px rgba(0,0,0,0.25),
                  0 8px 18px -6px rgba(28,26,23,0.35)
                `,
                border: `1px solid color-mix(in srgb, ${finishHex} 30%, black)`,
                transform: `translate(-50%, -50%) translateZ(8px)`,
              }}
              aria-hidden
            />
            <div
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-6 sm:w-6"
              style={{
                background:
                  "radial-gradient(circle at 40% 35%, #fffaf3, #efe8db 70%, #d4c4a8)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
              }}
              aria-hidden
            />

            {/* ROLL — motion arcs (always mounted) */}
            <span
              className="absolute -left-7 top-1/2 h-16 w-1.5 rounded-full"
              style={{
                background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${finishHex} 75%, black), transparent)`,
                ...cue(mode === "roll"),
              }}
              aria-hidden
            />
            <span
              className="absolute -right-6 top-1/3 h-12 w-1.5 rounded-full"
              style={{
                background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${finishHex} 75%, black), transparent)`,
                ...cue(mode === "roll", "50ms"),
              }}
              aria-hidden
            />
            <span
              className="absolute -right-4 bottom-1/4 h-8 w-1 rounded-full"
              style={{
                background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${finishHex} 60%, black), transparent)`,
                ...cue(mode === "roll", "100ms"),
              }}
              aria-hidden
            />
            {/* ROLL — kibble beads sitting in the track */}
            {[18, 130, 250].map((deg, i) => (
              <span
                key={`roll-bead-${deg}`}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #e8c9a0, #c4a06a)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  transform: `rotate(${deg}deg) translate(4.6rem, -50%) rotate(${-deg}deg) translate(-50%, -50%)`,
                  ...cue(mode === "roll", `${80 + i * 50}ms`),
                }}
                aria-hidden
              />
            ))}

            {/* PUZZLE — treat gate across the track (always mounted) */}
            <div
              className="absolute left-1/2 top-[27%] h-3 w-10 -translate-x-1/2 rounded-sm sm:h-3.5 sm:w-14"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${finishHex} 70%, black), color-mix(in srgb, ${finishHex} 45%, black))`,
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                ...cue(mode === "puzzle"),
              }}
              aria-hidden
            />
            {/* PUZZLE — blocked path ticks on the gate side */}
            {[40, 140, 260].map((deg) => (
              <span
                key={`puz-tick-${deg}`}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                style={{
                  background: `color-mix(in srgb, ${finishHex} 80%, black)`,
                  transform: `rotate(${deg}deg) translateY(-5.4rem) translate(-50%, -50%)`,
                  ...cue(mode === "puzzle"),
                }}
                aria-hidden
              />
            ))}

            {/* mode tick marks on outer rim */}
            {[0, 120, 240].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-ivory/85 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                style={{
                  transform: `rotate(${deg}deg) translateY(-7.6rem) translate(-50%, -50%)`,
                  transformOrigin: "center",
                }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        {!bare && (
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-sm tracking-[0.2em] text-charcoal">
                ROLLOVER ONE
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {finishName} finish
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
