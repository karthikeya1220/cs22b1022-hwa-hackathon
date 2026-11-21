import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
        This page rolled away
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        The order or page you requested is not here. If you just placed a test
        order, use the confirmation link from checkout.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-charcoal px-7 py-3.5 text-sm text-ivory transition hover:bg-clay"
        >
          Back home
        </Link>
        <Link
          href="/#product"
          className="rounded-full border border-line px-7 py-3.5 text-sm text-charcoal transition hover:border-charcoal"
        >
          Shop ROLLOVER ONE
        </Link>
      </div>
    </div>
  );
}
