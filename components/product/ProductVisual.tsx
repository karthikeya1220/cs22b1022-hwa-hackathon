type Props = {
  finishHex: string;
  finishName: string;
  className?: string;
};

export function ProductVisual({ finishHex, finishName, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-ivory via-ivory-deep to-sand/40 ${className}`}
      role="img"
      aria-label={`ROLLOVER ONE in ${finishName}`}
    >
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(212,196,168,0.5),transparent_45%)]" />

      <div className="relative flex h-full min-h-[320px] items-center justify-center p-8 sm:min-h-[420px]">
        <div className="relative h-56 w-56 sm:h-72 sm:w-72">
          {/* outer ring / roller body */}
          <div
            className="absolute inset-0 rounded-full shadow-[0_30px_60px_-20px_rgba(28,26,23,0.35)] ring-1 ring-charcoal/10"
            style={{
              background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${finishHex} 72%, white), ${finishHex} 58%, color-mix(in srgb, ${finishHex} 70%, black))`,
            }}
          />
          {/* inner well */}
          <div className="absolute inset-[18%] rounded-full bg-ivory/95 shadow-[inset_0_8px_24px_rgba(28,26,23,0.12)] ring-1 ring-charcoal/5" />
          {/* treat track */}
          <div
            className="absolute inset-[28%] rounded-full border-[3px] border-dashed opacity-70"
            style={{ borderColor: `color-mix(in srgb, ${finishHex} 55%, black)` }}
          />
          {/* center hub */}
          <div
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ring-1 ring-black/10"
            style={{ background: finishHex }}
          />
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory/90" />
          {/* mode tick marks */}
          {[0, 120, 240].map((deg) => (
            <span
              key={deg}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-ivory/80"
              style={{
                transform: `rotate(${deg}deg) translateY(-6.5rem) translate(-50%, -50%)`,
                transformOrigin: "center",
              }}
              aria-hidden
            />
          ))}
        </div>

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
      </div>
    </div>
  );
}
