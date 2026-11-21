"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { PRODUCT, formatPrice } from "@/lib/product";
import { EASE } from "@/components/motion/Reveal";

/**
 * Mobile-only sticky bar: appears once the buy box CTA scrolls away.
 */
export function MobileBuyBar() {
  const { count, openCart, subtotalCents } = useCart();
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const anchor = document.getElementById("product");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // show when product section is above viewport (scrolled past buy CTA)
        const rect = entry.boundingClientRect;
        setVisible(rect.bottom < 80);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  // Only on coarse pointers / small screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 py-3 shadow-[0_-12px_40px_-24px_rgba(28,26,23,0.4)] backdrop-blur-md sm:hidden"
          role="region"
          aria-label="Quick add to cart"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">ROLLOVER ONE</p>
              <p className="text-sm font-medium text-charcoal">
                {count > 0
                  ? `${count} in cart · ${formatPrice(subtotalCents)}`
                  : `From ${formatPrice(PRODUCT.price)}`}
              </p>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="shrink-0 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition hover:bg-clay active:scale-[0.98]"
            >
              {count > 0 ? "View cart" : "Shop now"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
