export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border bg-white" />
        <div className="h-64 animate-pulse rounded-2xl border bg-white" />
      </div>
    </div>
  );
}