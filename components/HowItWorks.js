const STEPS = [
  {
    n: "01",
    title: "Describe your need",
    body: "No dropdowns. Write it the way you'd tell a friend.",
  },
  {
    n: "02",
    title: "We score every car",
    body: "Budget fit, efficiency, safety, and use-case match — ranked, not guessed.",
  },
  {
    n: "03",
    title: "Build your shortlist",
    body: "Save contenders and compare them side by side before you decide.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid sm:grid-cols-3 gap-px bg-line rounded-xl overflow-hidden border border-line">
      {STEPS.map((s) => (
        <div key={s.n} className="bg-panel px-5 py-4">
          <span className="font-mono text-xs text-amber">{s.n}</span>
          <h3 className="font-display font-semibold text-sm text-cream mt-1">{s.title}</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
