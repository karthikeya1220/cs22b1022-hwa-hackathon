"use client";

import { PRODUCT, formatPrice, getFinish } from "@/lib/product";
import { useCart, type CartItem } from "@/lib/cart-context";
import { ProductVisual } from "@/components/product/ProductVisual";

type Props = {
  item: CartItem;
  compact?: boolean;
};

export function CartLine({ item, compact = false }: Props) {
  const { setQty, removeItem } = useCart();
  const finish = getFinish(item.variantId);
  const lineTotal = PRODUCT.price * item.qty;

  return (
    <div className="flex gap-4">
      <div
        className={`${compact ? "h-16 w-16" : "h-20 w-20"} shrink-0 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-white/70 via-ivory to-sand/30`}
        aria-hidden
      >
        <ProductVisual
          finishHex={finish?.hex ?? "#c45c3e"}
          finishName={finish?.name ?? "Clay"}
          bare
          compact
          className="h-full w-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-charcoal">
              {PRODUCT.name}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {finish?.name ?? item.variantId} finish
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums text-charcoal">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-line bg-white/60">
            <button
              type="button"
              className="h-8 w-8 text-charcoal transition hover:text-clay disabled:opacity-30"
              onClick={() => setQty(item.variantId, item.qty - 1)}
              disabled={item.qty <= 1}
              aria-label={`Decrease quantity of ROLLOVER ONE ${finish?.name ?? ""}`}
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums text-charcoal">
              {item.qty}
            </span>
            <button
              type="button"
              className="h-8 w-8 text-charcoal transition hover:text-clay disabled:opacity-30"
              onClick={() => setQty(item.variantId, item.qty + 1)}
              disabled={item.qty >= 10}
              aria-label={`Increase quantity of ROLLOVER ONE ${finish?.name ?? ""}`}
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="text-xs text-muted underline-offset-2 transition hover:text-clay hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
