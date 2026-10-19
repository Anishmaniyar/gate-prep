/** Minimal Axiom mark: graphite tile, off-white "A", ember crossbar. */
export function Logo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="15" fill="var(--graphite)" />
      <path
        d="M19.5 46 32 17.5 44.5 46"
        fill="none"
        stroke="var(--canvas)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 36.5h14"
        stroke="var(--ember)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
