"use client";

export default function Shortlist({ cars, onRemove }) {
  if (!cars.length) {
    return (
      <div className="bg-panel2 border border-line rounded-xl p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
          Shortlist
        </p>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Empty for now. Add cars from your results above to compare them side by side.
        </p>
      </div>
    );
  }

  const rows = [
    { key: "priceMinLakh", label: "Price", fmt: (c) => `₹${c.priceMinLakh}–${c.priceMaxLakh}L` },
    { key: "bodyType", label: "Body" },
    { key: "fuelType", label: "Fuel" },
    { key: "seats", label: "Seats" },
    { key: "mileage", label: "Mileage/Efficiency" },
    { key: "safetyRating", label: "Safety", fmt: (c) => (c.safetyRating != null ? `${c.safetyRating}/5` : "—") },
    { key: "fitScore", label: "Fit score", fmt: (c) => `${c.fitScore}/100` },
  ];

  return (
    <div className="bg-panel2 border border-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Shortlist ({cars.length})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-mono text-xs text-muted/70 pb-2 pr-3"> </th>
              {cars.map((c) => (
                <th key={c.id} className="text-left pb-2 pr-4 min-w-[140px]">
                  <div className="font-display font-semibold text-cream leading-tight">
                    {c.model}
                  </div>
                  <div className="text-xs text-muted">{c.brand}</div>
                  <button
                    onClick={() => onRemove(c.id)}
                    className="mt-1 text-[10px] font-mono text-muted hover:text-amber"
                  >
                    remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <td className="py-2 pr-3 text-muted/70 whitespace-nowrap">{row.label}</td>
                {cars.map((c) => (
                  <td key={c.id} className="py-2 pr-4 text-cream capitalize">
                    {row.fmt ? row.fmt(c) : String(c[row.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
