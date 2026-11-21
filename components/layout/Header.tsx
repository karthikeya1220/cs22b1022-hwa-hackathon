"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.18em] text-charcoal transition-colors hover:text-clay"
        >
          ROLLOVER
        </Link>

        <nav className="flex items-center gap-6 text-sm tracking-wide text-muted">
          <Link href="/#product" className="hidden sm:inline hover:text-charcoal">
            The ONE
          </Link>
          <Link href="/#how" className="hidden sm:inline hover:text-charcoal">
            How it works
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-line bg-white/60 px-4 py-2 text-charcoal transition hover:border-clay hover:text-clay"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-medium text-ivory">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
