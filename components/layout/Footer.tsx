import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display tracking-[0.18em] text-charcoal">ROLLOVER</p>
          <p className="mt-1 text-sm text-muted">
            Premium enrichment for calmer dogs.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted">
          <Link href="/#product" className="hover:text-charcoal">
            ROLLOVER ONE
          </Link>
          <Link href="/cart" className="hover:text-charcoal">
            Cart
          </Link>
          <Link href="/checkout" className="hover:text-charcoal">
            Checkout
          </Link>
        </div>
        <p className="text-xs text-muted">
          Demo storefront · Simulated payments only
        </p>
      </div>
    </footer>
  );
}
