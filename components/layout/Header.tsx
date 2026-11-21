"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { count, openCart } = useCart();
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 400);
      return () => window.clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.18em] text-charcoal transition-colors hover:text-clay focus-visible:outline-clay"
        >
          ROLLOVER
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-4 text-sm tracking-wide text-muted sm:gap-6"
        >
          <Link
            href="/#product"
            className="hidden rounded-full px-2 py-1 transition hover:text-charcoal sm:inline"
          >
            The ONE
          </Link>
          <Link
            href="/#how"
            className="hidden rounded-full px-2 py-1 transition hover:text-charcoal sm:inline"
          >
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
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-medium text-ivory ${
                  pulse ? "animate-badge-pop" : ""
                }`}
                aria-hidden
              >
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
