import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileBuyBar } from "@/components/product/MobileBuyBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROLLOVER ONE — Enrichment that wears them out",
  description:
    "ROLLOVER ONE is a premium multi-mode dog enrichment device. Calm focus at mealtime and play — one considered object, not a toy bin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileBuyBar />
        </CartProvider>
      </body>
    </html>
  );
}
