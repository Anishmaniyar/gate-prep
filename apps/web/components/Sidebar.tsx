"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", hint: "Overview & streak" },
  { href: "/planly", label: "Planly", hint: "Day-wise planner" },
  { href: "/goal-planner", label: "Goal Planner", hint: "Two-month plan" },
  { href: "/subjects", label: "Subjects", hint: "Syllabus progress" },
] as const;

function RowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-slate transition-colors duration-200 group-hover:text-ember">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 rounded-cards border border-mist bg-ash p-5">
        <div className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
          Workspace
        </div>
        <p className="mt-1 text-[13px] leading-[1.54] text-steel">
          GATE 2027 CS · single-user
        </p>
        <nav className="mt-5 flex flex-col gap-1" aria-label="Workspace">
          {NAV.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center justify-between rounded-buttons px-3 py-2 text-[13px] transition-colors duration-200 ${
                  active ? "bg-fog text-graphite" : "text-steel hover:bg-fog hover:text-graphite"
                }`}
              >
                <span>
                  <span className="block text-[15px] leading-none text-graphite">{item.label}</span>
                  <span className="mt-1 block text-[13px] leading-none text-steel">{item.hint}</span>
                </span>
                <RowIcon />
              </Link>
            );
          })}
        </nav>
        <div className="mx-0 mt-5 border-t border-mist pt-4 text-[13px] leading-[1.54] text-slate">
          Quiet progress, daily.
        </div>
      </div>
    </aside>
  );
}
