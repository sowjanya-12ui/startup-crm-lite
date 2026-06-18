/**
 * LoadingSkeleton
 * Pulse-animated skeleton placeholders shown while analytics data loads.
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards skeleton — 3 cols */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="h-3 w-20 rounded bg-gray-200 mb-3" />
            <div className="h-7 w-16 rounded bg-gray-200 mb-2" />
            <div className="h-2.5 w-12 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Chart row 1 — 2 cols */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-36 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-24 rounded bg-gray-100 mb-6" />
            <div className="h-56 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Chart row 2 — 2 cols */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-36 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-24 rounded bg-gray-100 mb-6" />
            <div className="h-56 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Wide chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-48 rounded bg-gray-200 mb-2" />
        <div className="h-3 w-32 rounded bg-gray-100 mb-6" />
        <div className="h-40 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
