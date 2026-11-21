"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCT, type FinishId } from "@/lib/product";

export type CartItem = {
  productId: string;
  variantId: FinishId;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotalCents: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: FinishId, qty?: number) => void;
  setQty: (variantId: FinishId, qty: number) => void;
  removeItem: (variantId: FinishId) => void;
  clear: () => void;
};

const STORAGE_KEY = "rollover-cart-v1";
const MAX_QTY = 10;

const CartContext = createContext<CartContextValue | null>(null);

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        i.productId === PRODUCT.id &&
        typeof i.variantId === "string" &&
        typeof i.qty === "number" &&
        i.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((variantId: FinishId, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === variantId
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) }
            : i,
        );
      }
      return [...prev, { productId: PRODUCT.id, variantId, qty: Math.min(MAX_QTY, qty) }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((variantId: FinishId, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.variantId !== variantId);
      return prev.map((i) =>
        i.variantId === variantId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i,
      );
    });
  }, []);

  const removeItem = useCallback((variantId: FinishId) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const subtotalCents = useMemo(
    () =>
      items.reduce((sum, i) => {
        if (i.productId !== PRODUCT.id) return sum;
        return sum + PRODUCT.price * i.qty;
      }, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      count,
      subtotalCents,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [
      items,
      isOpen,
      count,
      subtotalCents,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
