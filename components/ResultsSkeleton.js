export default function ResultsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-panel border border-line rounded-xl p-5 flex flex-col gap-4 animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-16 bg-line rounded" />
              <div className="h-4 w-40 bg-line rounded" />
            </div>
            <div className="h-16 w-16 rounded-full bg-line shrink-0" />
          </div>
          <div className="h-3 w-full bg-line rounded" />
          <div className="h-3 w-3/4 bg-line rounded" />
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-line">
            {Array.from({ length: 6 }).map((__, j) => (
              <div key={j} className="h-2.5 bg-line rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
