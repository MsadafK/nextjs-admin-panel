export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-7 w-48" />
        <div className="skeleton h-4 w-72" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-7 w-24" />
              </div>
              <div className="skeleton h-9 w-9 rounded-md" />
            </div>
            <div className="skeleton h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left card */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="skeleton h-8 w-8 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right card */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <div className="skeleton h-4 w-28" />
          </div>
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
