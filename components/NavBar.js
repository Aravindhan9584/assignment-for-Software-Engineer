export default function NavBar() {
  return (
    <nav className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#2A303A" strokeWidth="2" />
            <circle cx="12" cy="12" r="7" stroke="#E8A33D" strokeWidth="2" />
          </svg>
          <span className="font-display font-semibold text-cream tracking-tight">
            Shortlist
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted uppercase tracking-widest hidden sm:block">
          India car research
        </span>
      </div>
    </nav>
  );
}
