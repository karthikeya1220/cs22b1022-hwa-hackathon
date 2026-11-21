"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { formatPrice } from "@/lib/product";
import { orderTotals } from "@/lib/pricing";

type FieldErrors = Partial<Record<keyof FormValues, string>>;

type FormValues = {
  email: string;
  name: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  phone: string;
};

const empty: FormValues = {
  email: "",
  name: "",
  address: "",
  city: "",
  postal: "",
  country: "",
  phone: "",
};

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const email = values.email.trim();
  if (!email) errors.email = "Email is required for the receipt.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";

  if (!values.name.trim()) errors.name = "Full name is required.";
  if (!values.address.trim()) errors.address = "Street address is required.";
  if (!values.city.trim()) errors.city = "City is required.";
  if (!values.postal.trim()) errors.postal = "Postal code is required.";
  if (!values.country.trim()) errors.country = "Country is required.";
  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number.";

  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, count, subtotalCents, clear } = useCart();
  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { shipping, total } = orderTotals(subtotalCents, count);

  const totalsLabel = useMemo(
    () => formatPrice(total),
    [total],
  );

  const setField = (key: keyof FormValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      const next = validate({ ...values, [key]: value });
      setErrors((e) => ({ ...e, [key]: next[key] }));
    }
  };

  const onBlur = (key: keyof FormValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const next = validate(values);
    setErrors((e) => ({ ...e, [key]: next[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      email: true,
      name: true,
      address: true,
      city: true,
      postal: true,
      country: true,
      phone: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      const first = document.querySelector<HTMLElement>("[data-invalid='true']");
      first?.focus();
      return;
    }

    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMode: "simulated",
          customer: {
            email: values.email.trim(),
            name: values.name.trim(),
            phone: values.phone.trim() || undefined,
            address: values.address.trim(),
            city: values.city.trim(),
            postal: values.postal.trim(),
            country: values.country.trim(),
          },
          items: items.map((i) => ({
            variantId: i.variantId,
            qty: i.qty,
          })),
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { id?: string; error?: string }
        | null;

      if (!res.ok || !data?.id) {
        setSubmitError(
          data?.error ||
            "We could not place the test order. Please try again.",
        );
        return;
      }

      clear();
      router.push(`/order/${data.id}`);
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl text-charcoal">Checkout</h1>
        <p className="mt-4 text-sm text-muted">
          Add ROLLOVER ONE to your cart before checking out.
        </p>
        <a
          href="/#product"
          className="mt-8 inline-block rounded-full bg-charcoal px-7 py-3.5 text-sm text-ivory transition hover:bg-clay"
        >
          Shop the ONE
        </a>
      </div>
    );
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-line bg-white/70 px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 outline-none transition focus:border-charcoal/40 focus:bg-white";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-charcoal sm:text-4xl">
            Where should ONE go?
          </h1>
          <p className="mt-3 text-sm text-muted">
            Guest checkout · no account required.
          </p>
        </div>

        <div className="rounded-2xl border border-clay/35 bg-clay-soft/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-deep">
            Simulated payment — demo only
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">
            This storefront does not process real payments. No card details are
            collected. Placing an order creates a{" "}
            <strong className="font-medium">test order</strong> only — nothing
            is charged.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-white/80 px-3 py-1.5 font-medium text-charcoal ring-1 ring-clay/25">
              Demo payment selected
            </span>
            <span className="rounded-full px-3 py-1.5 text-muted">
              Card fields disabled by design
            </span>
          </div>
        </div>

        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-display text-xl text-charcoal">
            Contact
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                data-invalid={errors.email ? "true" : undefined}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputCls}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <span id="email-error" className="mt-1 block text-xs text-clay-deep">
                  {errors.email}
                </span>
              )}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Full name
              </span>
              <input
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => onBlur("name")}
                data-invalid={errors.name ? "true" : undefined}
                aria-invalid={!!errors.name}
                className={inputCls}
                placeholder="Alex Rivera"
                required
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.name}
                </span>
              )}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Phone <span className="normal-case tracking-normal">(optional)</span>
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
                onBlur={() => onBlur("phone")}
                data-invalid={errors.phone ? "true" : undefined}
                aria-invalid={!!errors.phone}
                className={inputCls}
                placeholder="+1 555 000 1234"
              />
              {errors.phone && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.phone}
                </span>
              )}
            </label>
          </div>
        </section>

        <section aria-labelledby="shipping-heading">
          <h2
            id="shipping-heading"
            className="font-display text-xl text-charcoal"
          >
            Shipping address
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Street address
              </span>
              <input
                type="text"
                autoComplete="street-address"
                value={values.address}
                onChange={(e) => setField("address", e.target.value)}
                onBlur={() => onBlur("address")}
                data-invalid={errors.address ? "true" : undefined}
                aria-invalid={!!errors.address}
                className={inputCls}
                placeholder="12 Harbor Lane"
                required
              />
              {errors.address && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.address}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                City
              </span>
              <input
                type="text"
                autoComplete="address-level2"
                value={values.city}
                onChange={(e) => setField("city", e.target.value)}
                onBlur={() => onBlur("city")}
                data-invalid={errors.city ? "true" : undefined}
                aria-invalid={!!errors.city}
                className={inputCls}
                placeholder="Portside"
                required
              />
              {errors.city && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.city}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Postal code
              </span>
              <input
                type="text"
                autoComplete="postal-code"
                value={values.postal}
                onChange={(e) => setField("postal", e.target.value)}
                onBlur={() => onBlur("postal")}
                data-invalid={errors.postal ? "true" : undefined}
                aria-invalid={!!errors.postal}
                className={inputCls}
                placeholder="400001"
                required
              />
              {errors.postal && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.postal}
                </span>
              )}
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Country
              </span>
              <input
                type="text"
                autoComplete="country-name"
                value={values.country}
                onChange={(e) => setField("country", e.target.value)}
                onBlur={() => onBlur("country")}
                data-invalid={errors.country ? "true" : undefined}
                aria-invalid={!!errors.country}
                className={inputCls}
                placeholder="India"
                required
              />
              {errors.country && (
                <span className="mt-1 block text-xs text-clay-deep">
                  {errors.country}
                </span>
              )}
            </label>
          </div>
        </section>

        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-clay/40 bg-clay-soft/40 px-4 py-3 text-sm text-clay-deep"
          >
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full rounded-full bg-charcoal px-8 py-4 text-sm font-medium tracking-wide text-ivory transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory"
                aria-hidden
              />
              Placing test order…
            </span>
          ) : (
            `Place test order — ${totalsLabel}`
          )}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          By placing a test order you agree this is a simulated demo. Customer
          details are used only to create the order receipt and are never shown
          in order lookup responses.
        </p>
      </div>

      <OrderSummary />
    </form>
  );
}
