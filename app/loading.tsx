export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-56 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded border border-ink/10 bg-white p-4 shadow-soft">
            <div className="aspect-square animate-pulse rounded bg-ink/10" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-ink/10" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-ink/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
