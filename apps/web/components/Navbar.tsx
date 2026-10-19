"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { STREAK_EVENT, type StreakState } from "@/lib/dashboard";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/planly", label: "Planly" },
  { href: "/goal-planner", label: "Goal Planner" },
  { href: "/subjects", label: "Subjects" },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("axiom:theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };
  return { dark, toggle };
}

export function Navbar() {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [streak, setStreak] = useState<StreakState | null>(null);

  // Live streak: refetch on navigation/focus, and accept broadcast updates
  // from the dashboard after a task is completed.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const res = await api.get<StreakState>("/streak");
      if (!cancelled && res) setStreak(res);
    };
    const onStreak = (event: Event) => {
      const detail = (event as CustomEvent<StreakState>).detail;
      if (detail) setStreak(detail);
      else load();
    };
    load();
    window.addEventListener(STREAK_EVENT, onStreak);
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      window.removeEventListener(STREAK_EVENT, onStreak);
      window.removeEventListener("focus", load);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 h-14 bg-canvas/90 backdrop-blur border-b border-mist">
      <div className="mx-auto flex h-14 w-full max-w-[var(--page-max-width)] items-center gap-3 px-6">
        {/* Brand mark: 20px graphite square + serif wordmark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Axiom home">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-graphite text-canvas font-display text-[13px] font-normal leading-none">
            A
          </span>
          <span className="font-display text-[19px] font-normal tracking-[-0.02em] text-graphite">
            Axiom
          </span>
        </Link>

        {/* Desktop pill nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-nav-pills px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${
                  active ? "bg-ash text-graphite" : "text-steel hover:bg-fog hover:text-graphite"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Streak pill — the one ember accent per screen */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-canvas px-3 py-1 text-[11px] text-steel"
            title={
              streak?.activeToday
                ? "Study streak · active today"
                : "Study streak · complete a task today to keep it"
            }
            aria-live="polite"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={streak?.activeToday ? "text-ember" : "text-slate"}
              aria-hidden="true"
            >
              <path d="M12 2c1 4-2 5-2 8a4.5 4.5 0 0 0 9 .5C19 6 14 4 12 2zm-1 20a6.5 6.5 0 0 1-6.4-7.6c.4-2 1.7-3.7 2.9-5.2.4 1.4 1.2 2.4 2.5 3 .3-2.2 1.2-4 2.5-5.4A8.5 8.5 0 0 0 11 22z" />
            </svg>
            <span className="text-graphite tabular-nums">{streak?.streak ?? "—"}</span> day streak
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-buttons text-slate transition-colors duration-200 hover:bg-fog hover:text-graphite"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenu((v) => !v)}
              aria-label="Account menu"
              aria-expanded={menu}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-fog text-[13px] font-medium text-graphite transition-colors duration-200 hover:bg-ash"
            >
              P
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div className="dropdown-panel absolute right-0 z-20 mt-2 w-44 py-1.5">
                  <div className="px-4 py-2 text-[13px] text-graphite">Aspirant</div>
                  <div className="mx-4 border-t border-mist" />
                  <Link href="/" onClick={() => setMenu(false)} className="block px-4 py-2 text-[13px] text-steel hover:bg-fog hover:text-graphite">
                    Dashboard
                  </Link>
                  <Link href="/subjects" onClick={() => setMenu(false)} className="block px-4 py-2 text-[13px] text-steel hover:bg-fog hover:text-graphite">
                    Syllabus
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile horizontal scroll nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-mist px-6 py-2 md:hidden" aria-label="Primary mobile">
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-nav-pills px-3.5 py-1.5 text-[13px] ${
                active ? "bg-ash text-graphite" : "text-steel"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
