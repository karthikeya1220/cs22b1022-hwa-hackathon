"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { CartLine } from "@/components/cart/CartLine";
import { formatPrice } from "@/lib/product";

export function CartDrawer() {
  const { items, isOpen, closeCart, count, subtotalCents } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCart();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <button
        type="button"
        className="animate-backdrop-in absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close cart"
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2
              id="cart-drawer-title"
              className="font-display text-lg tracking-wide text-charcoal"
            >
              Your cart
            </h2>
            <p className="text-xs text-muted" aria-live="polite">
              {count} item{count === 1 ? "" : "s"}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-charcoal transition hover:border-charcoal hover:bg-white/60"
            aria-label="Close cart"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className="h-16 w-16 rounded-full border-2 border-dashed border-line"
                aria-hidden
              />
              <p className="mt-5 font-display text-lg text-charcoal">
                Your cart is empty
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Add ROLLOVER ONE in the finish that matches your home.
              </p>
              <Link
                href="/#product"
                onClick={closeCart}
                className="mt-6 rounded-full bg-charcoal px-6 py-3 text-sm text-ivory transition hover:bg-clay"
              >
                Shop the ONE
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.variantId}>
                  <CartLine item={item} compact />
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium tabular-nums text-charcoal">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Shipping calculated at checkout · Simulated demo payment
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="rounded-full bg-charcoal px-6 py-3.5 text-center text-sm font-medium text-ivory transition hover:bg-clay"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="rounded-full border border-line px-6 py-3.5 text-center text-sm text-charcoal transition hover:border-charcoal"
              >
                View full cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
