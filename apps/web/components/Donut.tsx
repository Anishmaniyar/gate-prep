/** Thin neutral donut ring. Progress always comes from props — never hardcoded. */
export function Donut({ percent, completed, total }: { percent: number; completed: number; total: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`${clamped}% of syllabus complete`}>
        <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#262626" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#d4d4d4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (C * clamped) / 100}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-medium text-neutral-100">{clamped}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-sm text-neutral-200">Topics completed: {completed} / {total}</div>
        <div className="text-xs text-neutral-500 mt-1">Computed from topic completion data.</div>
      </div>
    </div>
  );
}
