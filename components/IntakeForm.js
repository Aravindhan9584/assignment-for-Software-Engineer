"use client";

import { useState } from "react";

const EXAMPLES = [
  "Family car under 15 lakh, mostly city driving, good safety",
  "First car, budget under 8 lakh, low running cost",
  "7-seater for highway road trips, diesel preferred",
  "Something quick and fun under 20 lakh",
];

export default function IntakeForm({ onSubmit, loading }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
        What are you looking for?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Family car under 15 lakh, mostly city driving, good safety ratings"
          rows={2}
          className="flex-1 bg-panel border border-line rounded-lg px-4 py-3 text-cream placeholder:text-muted/70 focus:outline-none focus:border-amber resize-none font-body"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="shrink-0 bg-amber text-dash font-display font-semibold px-6 py-3 rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? "Ranking…" : "Find my shortlist"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setQuery(ex)}
            className="text-xs font-mono text-muted border border-line rounded-full px-3 py-1 hover:border-amber hover:text-amber transition"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  );
}
