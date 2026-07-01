"use client";

import FitGauge from "./FitGauge";

const FUEL_LABEL = {
  petrol: "Petrol",
  diesel: "Diesel",
  cng: "CNG",
  hybrid: "Hybrid",
  electric: "Electric",
};

export default function CarCard({ car, onToggleShortlist, isShortlisted, expanded, onToggleExpand }) {
  return (
    <div className="bg-panel border border-line rounded-xl p-5 flex flex-col gap-4 hover:border-line/80 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{car.brand}</p>
          <h3 className="font-display font-semibold text-lg text-cream leading-tight">
            {car.model} <span className="text-muted font-normal">{car.variant}</span>
          </h3>
        </div>
        <FitGauge score={car.fitScore} />
      </div>

      <p className="text-sm text-cream/90 leading-relaxed">{car.explanation}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs text-muted border-t border-line pt-3">
        <Spec label="Price" value={`₹${car.priceMinLakh}–${car.priceMaxLakh}L`} />
        <Spec label="Body" value={car.bodyType} />
        <Spec label="Fuel" value={FUEL_LABEL[car.fuelType] || car.fuelType} />
        <Spec label="Seats" value={car.seats} />
        <Spec
          label={car.fuelType === "electric" ? "Efficiency" : "Mileage"}
          value={car.fuelType === "electric" ? `${car.mileage} kWh/100km` : `${car.mileage} kmpl`}
        />
        <Spec label="Safety" value={car.safetyRating != null ? `${car.safetyRating}/5` : "—"} />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onToggleExpand}
          className="text-xs font-mono text-muted hover:text-amber transition"
        >
          {expanded ? "Hide score breakdown" : "Show score breakdown"}
        </button>
        <button
          onClick={() => onToggleShortlist(car.id)}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border transition ${
            isShortlisted
              ? "bg-amber text-dash border-amber"
              : "border-line text-cream hover:border-amber hover:text-amber"
          }`}
        >
          {isShortlisted ? "Shortlisted ✓" : "Add to shortlist"}
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line">
          {Object.entries(car.scoreBreakdown).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-good" style={{ width: `${val}%` }} />
              </div>
              <span className="font-mono text-[10px] text-muted w-20">{formatLabel(key)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted/70">{label}</span>
      <span className="text-cream capitalize">{value}</span>
    </div>
  );
}

function formatLabel(key) {
  return {
    budgetFit: "Budget fit",
    efficiency: "Efficiency",
    safety: "Safety",
    useCaseFit: "Use-case fit",
  }[key] || key;
}
