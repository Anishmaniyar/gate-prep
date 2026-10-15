export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full bg-neutral-800 rounded" role="progressbar" aria-valuenow={value}>
      <div className="h-1.5 bg-neutral-300 rounded" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-medium text-neutral-300 mt-8 mb-3">{children}</h2>;
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border border-neutral-800 rounded p-4 bg-neutral-950">{children}</div>;
}

export function SampleBadge() {
  return (
    <span className="inline-block text-[11px] border border-neutral-700 text-neutral-400 rounded px-1.5 py-0.5 ml-2">
      SAMPLE
    </span>
  );
}
