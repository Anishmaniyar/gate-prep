"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    ),
  },
  {
    href: "/planly",
    label: "Planly",
    icon: (
      <path d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    ),
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: (
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5z" />
    ),
  },
  {
    href: "/pyqs",
    label: "PYQs",
    icon: (
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6" />
    ),
  },
  {
    href: "/practice",
    label: "Practice",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="0.5" />
      </>
    ),
  },
] as const;

const STORAGE_KEY = "axiom:sidebar-collapsed";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    setCollapsed((v) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, v ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !v;
    });
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-black border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-neutral-100">Axiom</span>
        <button
          onClick={() => setDrawer(true)}
          className="border border-neutral-800 rounded px-3 py-1 text-sm text-neutral-300"
          aria-label="Open navigation"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-neutral-950 border-r border-neutral-800 px-4 py-6">
            <SidebarBody onNavigate={() => setDrawer(false)} showLabels />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-neutral-800 px-3 py-6 sticky top-0 h-screen transition-[width] duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between px-1"}`}>
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold tracking-wide text-neutral-100">Axiom</div>
              <div className="text-xs text-neutral-500 mt-0.5">GATE 2027 CS</div>
            </div>
          )}
          {collapsed && <span className="text-sm font-semibold text-neutral-100" aria-hidden="true">A</span>}
          {!collapsed && (
            <button
              onClick={toggle}
              className="text-neutral-500 hover:text-neutral-200 px-1"
              aria-label="Collapse sidebar"
              title="Collapse"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm border transition-colors ${
                  collapsed ? "justify-center px-0" : ""
                } ${
                  active
                    ? "bg-neutral-900 border-neutral-700 text-neutral-100"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Icon>{item.icon}</Icon>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-6 ${collapsed ? "flex justify-center" : "px-1"}`}>
          {collapsed ? (
            <button
              onClick={toggle}
              className="text-neutral-500 hover:text-neutral-200"
              aria-label="Expand sidebar"
              title="Expand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
              </svg>
            </button>
          ) : (
            <div className="text-xs text-neutral-600">Single-user workspace</div>
          )}
        </div>
      </aside>
    </>
  );

  function SidebarBody({ onNavigate, showLabels }: { onNavigate: () => void; showLabels: boolean }) {
    return (
      <>
        <div className="mb-6 px-1">
          <div className="text-sm font-semibold tracking-wide text-neutral-100">Axiom</div>
          <div className="text-xs text-neutral-500 mt-0.5">GATE 2027 CS</div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm border ${
                  active
                    ? "bg-neutral-900 border-neutral-700 text-neutral-100"
                    : "border-transparent text-neutral-400"
                }`}
              >
                <Icon>{item.icon}</Icon>
                {showLabels && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </>
    );
  }
}
