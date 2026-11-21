import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — ROLLOVER",
  description:
    "Guest checkout for ROLLOVER ONE. Simulated demo payment — no real charge.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <CheckoutForm />
    </div>
  );
}
