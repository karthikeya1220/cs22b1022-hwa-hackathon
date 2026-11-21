export type Finish = {
  id: string;
  name: string;
  hex: string;
  description: string;
};

export const PRODUCT = {
  id: "rollover-one",
  name: "ROLLOVER ONE",
  tagline: "Enrichment that wears them out.",
  description:
    "A premium multi-mode enrichment device that turns mealtime and play into calm, focused work for your dog — without the clutter of a dozen toys.",
  price: 8900,
  currency: "USD" as const,
  finishes: [
    {
      id: "clay",
      name: "Clay",
      hex: "#c45c3e",
      description: "Warm terracotta",
    },
    {
      id: "sage",
      name: "Sage",
      hex: "#8a9a7b",
      description: "Soft garden green",
    },
    {
      id: "charcoal",
      name: "Charcoal",
      hex: "#2e2b26",
      description: "Deep graphite",
    },
  ] satisfies Finish[],
} as const;

export type FinishId = (typeof PRODUCT.finishes)[number]["id"];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function getFinish(id: string): Finish | undefined {
  return PRODUCT.finishes.find((f) => f.id === id);
}
