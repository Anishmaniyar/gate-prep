import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ——— Button: h-9 px-4 text-13, no shadows / gradients ——— */
type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-10 px-5 text-[13px]",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-graphite text-canvas hover:opacity-85",
  secondary: "border border-mist-strong bg-transparent text-graphite hover:bg-ash",
  ghost: "text-steel hover:bg-ash hover:text-graphite",
  destructive: "bg-danger text-canvas hover:opacity-85",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-buttons font-medium transition-opacity transition-colors duration-200 disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

/* ——— Card: rounded-11 + mist border + canvas/ash ——— */
export function Card({
  children,
  tone = "canvas",
  className = "",
}: {
  children: ReactNode;
  tone?: "canvas" | "ash";
  className?: string;
}) {
  return (
    <div
      className={`rounded-cards border border-mist p-6 md:p-7 ${
        tone === "ash" ? "bg-ash" : "bg-canvas"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ——— SectionCard: 19px serif title left + ghost View-all right, mt-5 content ——— */
export function SectionCard({
  title,
  actionHref,
  actionLabel = "View all →",
  children,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-cards border border-mist bg-canvas p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
          {title}
        </h2>
        {actionHref && (
          <Link
            href={actionHref}
            className="shrink-0 text-[13px] text-steel transition-colors duration-200 hover:text-ember"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-8 font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
      {children}
    </h2>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 w-full rounded-full bg-fog"
      role="progressbar"
      aria-valuenow={Math.round(value)}
    >
      <div
        className="h-1.5 rounded-full bg-graphite transition-all duration-200 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ——— Chips/tags: 6px, bg-fog, count suffix in slate ——— */
export function Chip({ label, count }: { label: string; count?: number | string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-tags bg-fog px-3 py-1 text-[13px] text-graphite">
      {label}
      {count !== undefined && <span className="text-slate">{count}</span>}
    </span>
  );
}

export function SampleBadge() {
  return (
    <span className="ml-2 inline-block rounded-tags bg-fog px-1.5 py-0.5 align-middle text-[11px] text-steel">
      SAMPLE
    </span>
  );
}

/* ——— Settings/topic row: full-width button, 36px fog tile, chevron ——— */
export function Row({
  icon,
  label,
  value,
  href,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {icon && (
        <span className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fog text-steel transition-colors duration-200 group-hover:text-ember">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[15px] text-graphite">{label}</span>
        {value && <span className="mt-0.5 block text-[13px] text-steel">{value}</span>}
      </span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-slate">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </>
  );
  const cls =
    "group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-200 hover:bg-fog";
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Divider() {
  return <div className="mx-5 border-t border-mist" />;
}

/* ——— Modal: graphite/50 overlay, ash panel, 14px ——— */
export function Modal({
  children,
  onClose,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-graphite/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel relative w-full max-w-md rounded-large bg-ash p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}
