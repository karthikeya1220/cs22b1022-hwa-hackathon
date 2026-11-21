const specs = [
  ["Product", "ROLLOVER ONE"],
  ["Modes", "Lick · Roll · Puzzle"],
  ["Diameter", "22 cm"],
  ["Weight", "1.4 kg"],
  ["Shell", "Matte soft-touch ABS"],
  ["Inserts", "Food-grade silicone, dishwasher-safe"],
  ["Base", "Weighted TPE, non-marking"],
  ["Finishes", "Clay · Sage · Charcoal"],
  ["In the box", "ONE body, 2 inserts, treat gate, quick guide"],
];

export function Specs() {
  return (
    <section className="border-t border-line bg-charcoal text-ivory">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay-soft">
              Specifications
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Considered down to the gram
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
              Every material choice is for quieter sessions, easier cleaning,
              and a silhouette you will not hide when guests come over.
            </p>
          </div>

          <dl className="divide-y divide-ivory/10 border-y border-ivory/10">
            {specs.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[minmax(7rem,0.4fr)_1fr] gap-4 py-4 text-sm"
              >
                <dt className="text-ivory/55">{k}</dt>
                <dd className="text-ivory">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
