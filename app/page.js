"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HowItWorks from "../components/HowItWorks";
import IntakeForm from "../components/IntakeForm";
import CarCard from "../components/CarCard";
import Shortlist from "../components/Shortlist";
import ResultsSkeleton from "../components/ResultsSkeleton";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState(null);
  const [usedAI, setUsedAI] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/shortlist")
      .then((r) => r.json())
      .then((d) => setShortlist(d.cars || []))
      .catch(() => {});
  }, []);

  async function handleSearch(query) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResults(data.results);
      setFilters(data.filters);
      setUsedAI(data.usedAI);
    } catch (e) {
      setError("Something went wrong fetching recommendations. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleShortlist(carId) {
    const already = shortlist.some((c) => c.id === carId);
    const res = await fetch("/api/shortlist", {
      method: already ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    });
    const data = await res.json();
    setShortlist(data.cars || []);
  }

  const hasSearched = results !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <header className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
              Shortlist · car research, decided
            </p>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl text-cream leading-[1.1] mb-3">
              Too many cars.
              <br />
              One right answer.
            </h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Describe what you actually need in plain words. We turn it into a ranked,
              explained shortlist — not another filter sidebar.
            </p>
          </header>

          <section className="mb-10">
            <IntakeForm onSubmit={handleSearch} loading={loading} />
            {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
            {filters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted/70">
                  Read as
                </span>
                {Object.entries(filters)
                  .filter(([k, v]) => v != null && v !== "" && !(Array.isArray(v) && v.length === 0))
                  .map(([k, v]) => (
                    <span
                      key={k}
                      className="font-mono text-[11px] text-cream bg-panel2 border border-line rounded-full px-2.5 py-1"
                    >
                      {k}: {Array.isArray(v) ? v.join(", ") : String(v)}
                    </span>
                  ))}
                <span className="font-mono text-[10px] text-muted/50 ml-1">
                  {usedAI ? "· parsed by Claude" : "· parsed by keyword fallback (no API key set)"}
                </span>
              </div>
            )}
          </section>

          {!hasSearched && !loading && (
            <section className="mb-12">
              <HowItWorks />
            </section>
          )}

          {loading && (
            <section className="mb-12">
              <ResultsSkeleton />
            </section>
          )}

          {!loading && results && (
            <section className="mb-12">
              <div className="flex items-baseline justify-between mb-4">
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {results.length} matches, ranked by fit
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {results.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onToggleShortlist={toggleShortlist}
                    isShortlisted={shortlist.some((c) => c.id === car.id)}
                    expanded={expandedId === car.id}
                    onToggleExpand={() => setExpandedId(expandedId === car.id ? null : car.id)}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <Shortlist cars={shortlist} onRemove={(id) => toggleShortlist(id)} />
          </section>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-muted/60">
            Built as a take-home demo. Dataset is illustrative, not live inventory.
          </span>
          <span className="font-mono text-[11px] text-muted/60">Shortlist © 2026</span>
        </div>
      </footer>
    </div>
  );
}
