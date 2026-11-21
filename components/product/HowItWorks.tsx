const steps = [
  {
    n: "01",
    title: "Load",
    body: "Add kibble or soft treats into the center well. Adjust difficulty with the simple treat gate.",
  },
  {
    n: "02",
    title: "Engage",
    body: "Your dog licks, rolls, and solves — three modes on one footprint, without a toy explosion.",
  },
  {
    n: "03",
    title: "Settle",
    body: "Focused work drops arousal. Sessions end in a calmer dog and a quieter room.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-t border-line bg-white/30">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
            Three steps. One calm ritual.
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-line bg-ivory/80 p-7 transition hover:border-charcoal/20 hover:bg-white/70"
            >
              <span className="font-display text-sm tracking-[0.2em] text-clay">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-2xl text-charcoal">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
