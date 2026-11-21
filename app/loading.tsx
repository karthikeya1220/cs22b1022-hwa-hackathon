import Link from "next/link";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-6xl px-5 py-16 sm:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-48 animate-pulse rounded-full bg-line/70" />
      <div className="mt-6 h-4 w-72 animate-pulse rounded-full bg-line/60" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded-full bg-line/50" />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-ivory-deep" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-line/60" />
          <div className="h-4 w-full animate-pulse rounded-full bg-line/50" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-line/40" />
          <div className="h-12 w-40 animate-pulse rounded-full bg-line/60" />
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        <Link href="/" className="underline-offset-4 hover:text-charcoal hover:underline">
          Return home
        </Link>
      </p>
    </div>
  );
}
