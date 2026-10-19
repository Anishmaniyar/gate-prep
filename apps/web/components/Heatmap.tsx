"use client";

import type { DayActivity } from "@/lib/dashboard";

function levelOf(a?: DayActivity): number {
  if (!a || (a.tasks === 0 && a.minutes === 0)) return 0;
  const score = a.tasks * 2 + a.minutes / 30;
  if (score <= 1) return 1;
  if (score <= 3) return 2;
  if (score <= 6) return 3;
  return 4;
}

/* Graphite-opacity scale — never green. Empty cells are fog. */
const OPACITY = [0, 0.25, 0.45, 0.7, 1];

function fmt(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function monthOf(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
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

  const hasAny = activity.some((a) => a.tasks > 0 || a.minutes > 0);
  const inRange = (d: Date) => d >= start && d <= end;

  return (
    <div>
      <div className="mb-1 flex gap-[3px]" aria-hidden="true">
        {weeks.map((week, i) => {
          const label = monthOf(week[0]);
          const show = i === 0 || label !== monthOf(weeks[i - 1][0]);
          return (
            <div key={i} className="min-w-0 flex-1 truncate text-10 leading-4 text-slate">
              {show ? label : ""}
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px]" role="img" aria-label="Daily study activity heatmap">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex min-w-0 flex-1 flex-col gap-[3px]">
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
                  className="aspect-square w-full rounded-[3px]"
                  style={{
                    backgroundColor:
                      !active || lvl === 0
                        ? "var(--fog)"
                        : `color-mix(in srgb, var(--graphite) ${OPACITY[lvl] * 100}%, var(--fog))`,
                    border: "1px solid var(--mist)",
                    outline: key === todayKey ? "1px solid var(--ember)" : undefined,
                    outlineOffset: 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-10 text-slate">
        <span>Less</span>
        {OPACITY.map((o, i) => (
          <span
            key={i}
            className="rounded-[3px] border border-mist"
            style={{
              width: 10,
              height: 10,
              backgroundColor:
                o === 0
                  ? "var(--fog)"
                  : `color-mix(in srgb, var(--graphite) ${o * 100}%, var(--fog))`,
            }}
          />
        ))}
        <span>More</span>
      </div>
      {!hasAny && (
        <p className="mt-2 text-[13px] text-steel">
          No study activity recorded yet — complete a task below and this heatmap will fill in.
        </p>
      )}
    </div>
  );
}
