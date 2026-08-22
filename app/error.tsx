"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-ink/65">The storefront could not load this view. Please try again.</p>
      <button className="mt-6 rounded bg-leaf px-5 py-3 font-semibold text-white" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
