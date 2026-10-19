/** Thin graphite donut. Progress always comes from props — never hardcoded. */
export function Donut({ percent, completed, total }: { percent: number; completed: number; total: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`${clamped}% of syllabus complete`}>
        <svg viewBox="0 0 120 120" className="h-24 w-24 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--fog)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--graphite)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (C * clamped) / 100}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[25px] font-light leading-[31px] tracking-[-0.02em] text-graphite">
            {clamped}%
          </span>
        </div>
      </div>
      <div className="min-w-0 text-[13px] text-steel">
        <span className="text-graphite tabular-nums">{completed}</span> of {total} topics completed
      </div>
    </div>
  );
}
