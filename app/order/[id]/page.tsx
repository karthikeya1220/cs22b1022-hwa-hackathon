import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/product";
import { getPublicReceipt } from "@/lib/orders";
import { isUpstashConfigured } from "@/lib/upstash";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation — ROLLOVER",
  description: "Your ROLLOVER test order receipt.",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isUpstashConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl text-charcoal">
          Order storage unavailable
        </h1>
        <p className="mt-4 text-sm text-muted">
          Receipts cannot be loaded right now. Please try again shortly.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-charcoal px-7 py-3.5 text-sm text-ivory transition hover:bg-clay"
        >
          Back home
        </Link>
      </div>
    );
  }

  const receipt = await getPublicReceipt(id);
  if (!receipt) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="rounded-3xl border border-line bg-white/60 p-7 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
              Order confirmed
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
              Thank you — you&apos;re all set
            </h1>
          </div>
          <span className="rounded-full bg-clay-soft/50 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-clay-deep ring-1 ring-clay/25">
            Payment simulated
          </span>
        </div>

        <div
          role="status"
          className="mt-5 rounded-xl border border-clay/30 bg-clay-soft/25 px-4 py-3 text-sm text-charcoal-soft"
        >
          <strong className="font-medium text-charcoal">No charge was made.</strong>{" "}
          This is a demo test order for the ROLLOVER storefront.
        </div>

        <dl className="mt-8 grid gap-4 border-y border-line py-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Order ID</dt>
            <dd className="mt-1 font-medium tabular-nums text-charcoal">
              {receipt.id}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Placed</dt>
            <dd className="mt-1 text-charcoal">
              {formatDate(receipt.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="mt-1 capitalize text-charcoal">{receipt.status}</dd>
          </div>
        </dl>

        <h2 className="mt-8 font-display text-xl text-charcoal">Items</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {receipt.items.map((item, i) => (
            <li
              key={`${item.finish}-${i}`}
              className="flex items-start justify-between gap-4 py-4 text-sm"
            >
              <div>
                <p className="font-medium text-charcoal">{item.name}</p>
                <p className="mt-0.5 text-muted">
                  {item.finish} finish · Qty {item.qty} ·{" "}
                  {formatPrice(item.unitPrice)} each
                </p>
              </div>
              <p className="shrink-0 tabular-nums text-charcoal">
                {formatPrice(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 ml-auto max-w-xs space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums text-charcoal">
              {formatPrice(receipt.subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums text-charcoal">
              {receipt.shipping === 0 ? "Free" : formatPrice(receipt.shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="font-medium text-charcoal">Total</dt>
            <dd className="font-medium tabular-nums text-charcoal">
              {formatPrice(receipt.total)}
            </dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-muted">Payment</dt>
            <dd className="text-muted">
              {receipt.payment.mode} · {receipt.payment.status.replace("_", " ")}
            </dd>
          </div>
        </dl>

        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          A copy of this receipt would go to your email in a live store. This
          demo does not store or display customer contact details in order
          lookups.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-charcoal px-7 py-3.5 text-sm text-ivory transition hover:bg-clay"
          >
            Back to ROLLOVER ONE
          </Link>
          <Link
            href="/#product"
            className="rounded-full border border-line px-7 py-3.5 text-sm text-charcoal transition hover:border-charcoal"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
