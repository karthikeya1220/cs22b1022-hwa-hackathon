type Props = {
  finishHex: string;
  finishName: string;
  /** Visual mode cue: how the disc is "posed" in the story. */
  mode?: "idle" | "lick" | "roll" | "puzzle";
  className?: string;
  /** Hide the caption strip (used when embedded in a larger stage). */
  bare?: boolean;
};

/**
 * ROLLOVER ONE — pure CSS product render with layered depth,
 * lighting, and contact shadow. Shared across hero, buy box,
 * mode explorer, and specs so the object stays continuous.
 *
 * Modes only re-pose the same object (track / tilt / gate cues);
 * they never invent hardware.
 */
export function ProductVisual({
  finishHex,
  finishName,
  mode = "idle",
  className = "",
  bare = false,
}: Props) {
  const roll =
    mode === "roll" ? -14 : mode === "puzzle" ? 6 : mode === "lick" ? 0 : 0;
  const lift = mode === "roll" ? 6 : mode === "puzzle" ? 2 : 0;

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
          {/* soft ground shadow */}
          <div
            className="absolute left-1/2 top-full h-10 w-[85%] -translate-x-1/2 -translate-y-1/3 rounded-[50%] blur-xl"
            style={{
              background: `radial-gradient(ellipse, rgba(28,26,23,${mode === "roll" ? 0.28 : 0.22}), transparent 70%)`,
            }}
            aria-hidden
          />

          {/* disc body */}
          <div className="relative h-56 w-56 sm:h-[19rem] sm:w-[19rem] md:h-[21rem] md:w-[21rem]">
            {/* side wall / thickness */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${finishHex} 75%, black) 0%, color-mix(in srgb, ${finishHex} 55%, black) 100%)`,
                transform: "translateY(10px)",
                boxShadow: "0 18px 36px -12px rgba(28,26,23,0.45)",
              }}
              aria-hidden
            />

            {/* top shell */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 32% 24%, rgba(255,255,255,0.55), transparent 42%),
                  radial-gradient(circle at 70% 78%, color-mix(in srgb, ${finishHex} 50%, black), transparent 50%),
                  radial-gradient(circle at 50% 45%, color-mix(in srgb, ${finishHex} 88%, white) 0%, ${finishHex} 48%, color-mix(in srgb, ${finishHex} 65%, black) 100%)
                `,
                boxShadow: `
                  inset 0 2px 6px rgba(255,255,255,0.35),
                  inset 0 -10px 24px rgba(0,0,0,0.22),
                  inset 0 0 0 1px color-mix(in srgb, ${finishHex} 40%, black),
                  0 28px 50px -22px rgba(28,26,23,0.4)
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
                  inset 0 10px 22px rgba(28,26,23,0.18),
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
                    : undefined,
                outlineOffset: mode === "puzzle" ? "6px" : undefined,
                transition: "opacity 0.5s ease, outline-color 0.5s ease",
              }}
              aria-hidden
            />

            {/* lick-mode inner sheen (soft silicone pad cue) */}
            {mode === "lick" && (
              <div
                className="absolute inset-[30%] rounded-full"
                style={{
                  background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${finishHex} 25%, white), color-mix(in srgb, ${finishHex} 12%, white))`,
                  boxShadow: "inset 0 4px 12px rgba(28,26,23,0.1)",
                  opacity: 0.9,
                }}
                aria-hidden
              />
            )}

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

            {/* roll cue — motion arcs */}
            {mode === "roll" && (
              <>
                <span
                  className="absolute -left-6 top-1/2 h-14 w-1 rounded-full opacity-50"
                  style={{
                    background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${finishHex} 70%, black), transparent)`,
                  }}
                  aria-hidden
                />
                <span
                  className="absolute -right-5 top-1/3 h-10 w-1 rounded-full opacity-40"
                  style={{
                    background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${finishHex} 70%, black), transparent)`,
                  }}
                  aria-hidden
                />
              </>
            )}

            {/* mode tick marks on outer rim */}
            {[0, 120, 240].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-ivory/85 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                style={{
                  transform: `rotate(${deg}deg) translateY(-7.2rem) translate(-50%, -50%)`,
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
            <div className="rounded-full border border-line bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur">
              Product render
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
