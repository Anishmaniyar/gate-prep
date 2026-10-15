"use client";

import type { DayActivity } from "@/lib/dashboard";

const CELL = 12;
const GAP = 3;

function levelOf(a?: DayActivity): number {
  if (!a || (a.tasks === 0 && a.minutes === 0)) return 0;
  const score = a.tasks * 2 + a.minutes / 30;
  if (score <= 1) return 1;
  if (score <= 3) return 2;
  if (score <= 6) return 3;
  return 4;
}

const FILL = ["#161616", "#2e2e2e", "#525252", "#8a8a8a", "#d4d4d4"];

function fmt(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function Heatmap({
  activity,
  startIso,
  targetIso,
}: {
  activity: DayActivity[];
  startIso: string;
  targetIso: string;
}) {
  const byDate = new Map(activity.map((a) => [a.date.slice(0, 10), a]));
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const start = new Date(startIso);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(Math.max(new Date(targetIso).getTime(), today.getTime()));
  end.setUTCHours(0, 0, 0, 0);

  // Align to full weeks (Sun–Sat) so every date in the period is visible.
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
  const gridEnd = new Date(end);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));

  const weeks: Date[][] = [];
  for (let d = new Date(gridStart); d <= gridEnd; d.setUTCDate(d.getUTCDate() + 7)) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(d);
      day.setUTCDate(day.getUTCDate() + i);
      week.push(day);
    }
    weeks.push(week);
  }

  const monthLabels: { index: number; label: string }[] = [];
  weeks.forEach((week, i) => {
    const first = week[0];
    const month = first.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    const prev = i === 0 ? null : weeks[i - 1][0].toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    if (month !== prev) monthLabels.push({ index: i, label: month });
  });

  const hasAny = activity.some((a) => a.tasks > 0 || a.minutes > 0);
  const inRange = (d: Date) => d >= start && d <= end;

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div style={{ width: "max-content" }}>
          <div className="relative h-4 mb-1" aria-hidden="true">
            {monthLabels.map((m) => (
              <span
                key={m.index}
                className="absolute text-[10px] text-neutral-500"
                style={{ left: m.index * (CELL + GAP) }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex" style={{ gap: GAP }} role="img" aria-label="Daily study activity heatmap">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((day, di) => {
                  const key = day.toISOString().slice(0, 10);
                  const a = byDate.get(key);
                  const active = inRange(day);
                  const lvl = active ? levelOf(a) : 0;
                  const label = !active
                    ? `${fmt(key)}: outside preparation period`
                    : a && (a.tasks > 0 || a.minutes > 0)
                      ? `${fmt(key)}: ${a.tasks} task${a.tasks === 1 ? "" : "s"} · ${a.minutes} min`
                      : `${fmt(key)}: no activity`;
                  return (
                    <div
                      key={di}
                      title={label}
                      aria-label={label}
                      className="rounded-[2px]"
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: active ? FILL[lvl] : "transparent",
                        border: active ? "1px solid #262626" : "1px solid transparent",
                        outline: key === todayKey ? "1px solid #737373" : undefined,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-neutral-500">
            <span>Less</span>
            {FILL.map((f, i) => (
              <span key={i} className="rounded-[2px] border border-neutral-800" style={{ width: 10, height: 10, backgroundColor: f }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
      {!hasAny && (
        <p className="text-xs text-neutral-500 mt-2">
          No study activity recorded yet — complete a task below and this heatmap will fill in.
        </p>
      )}
    </div>
  );
}
