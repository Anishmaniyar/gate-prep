"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, API_URL } from "@/lib/api";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  type GoalMonth,
  type GoalPlanResponse,
  type GoalWeek,
} from "@/lib/goalPlan";
import { Button, ProgressBar, SectionCard } from "@/components/ui";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatRange(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function parseTargetFocus(focus: string): { target: string | null; points: string[] } {
  const trimmed = focus.trim();
  const match = trimmed.match(/^Target\s+([^:]+):\s*(.*)$/i);
  const target = match ? match[1].trim() : null;
  const body = (match ? match[2] : trimmed).replace(/\.$/, "");
  return {
    target,
    points: body
      .split(/,\s*/)
      .map((point) => point.trim())
      .filter(Boolean),
  };
}

function parseGoalGroups(goal: string): { label: string | null; points: string[] }[] {
  return goal
    .split(/\.\s+/)
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^([^:]{1,60}):\s*(.*)$/);
      const label = match ? match[1].trim() : null;
      const body = match ? match[2] : chunk;
      return {
        label,
        points: body
          .split(/,\s*/)
          .map((point) => point.trim())
          .filter(Boolean),
      };
    });
}

function PointList({
  points,
  size = "sm",
  columns = 2,
}: {
  points: string[];
  size?: "sm" | "md";
  columns?: 1 | 2;
}) {
  const text = size === "md" ? "text-[13px] leading-[1.6]" : "text-[11px] leading-[1.5]";
  return (
    <ul
      className={`mt-1 grid grid-cols-1 gap-x-4 gap-y-1 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {points.map((point) => (
        <li key={point} className={`flex gap-1.5 text-steel ${text}`}>
          <span
            aria-hidden="true"
            className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-mist-strong"
          />
          <span className="min-w-0">{point}</span>
        </li>
      ))}
    </ul>
  );
}

function MonthStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-canvas px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-0.5 text-[13px] text-graphite tabular-nums">{value}</p>
    </div>
  );
}

function MonthCard({ month }: { month: GoalMonth }) {
  return (
    <SectionCard title={month.title}>
      <p className="text-[13px] text-steel">{formatRange(month.startDate, month.endDate)}</p>

      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-buttons border border-mist bg-mist">
        <MonthStat label="Topics" value={`${month.progress.completed}/${month.progress.total}`} />
        <MonthStat label="Weeks" value={`${month.weeksCompleted}/${month.weeksTotal}`} />
        <MonthStat label="Progress" value={`${month.progress.percent}%`} />
      </div>
      <div className="mt-2">
        <ProgressBar value={month.progress.percent} />
      </div>

      {month.goal && (
        <div className="mt-4 border-t border-mist pt-3">
          <p className="text-[10px] uppercase tracking-wide text-slate">Month focus</p>
          <p className="mt-1 text-[13px] leading-[1.6] text-graphite">{month.goal}</p>
        </div>
      )}

      <div className="mt-4 border-t border-mist pt-3">
        <p className="text-[10px] uppercase tracking-wide text-slate">Subjects</p>
        <ul className="mt-1 divide-y divide-mist">
          {month.subjects.map((subject) => {
            const focus = subject.focus ? parseTargetFocus(subject.focus) : null;
            return (
              <li key={subject.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-[13px] text-graphite">{subject.name}</p>
                  <span className="shrink-0 rounded-tags border border-mist-strong bg-fog px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate">
                    {PRIORITY_LABEL[subject.priority]}
                  </span>
                </div>
                {focus && (
                  <div className="mt-1.5">
                    {focus.target && (
                      <p className="text-[10px] uppercase tracking-wide text-slate">
                        Target {focus.target}
                      </p>
                    )}
                    <PointList points={focus.points} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionCard>
  );
}

function WeekCard({ week, defaultOpen }: { week: GoalWeek; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-cards border border-mist bg-canvas">
      <div className="px-5 py-4">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full rounded-buttons text-left"
        >
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[15px] font-medium text-graphite">
              Week {week.weekNumber} · {week.title}
            </span>
            <span className="text-[13px] text-steel">{formatRange(week.startDate, week.endDate)}</span>
          </span>
          <span className="mt-1 flex flex-wrap justify-between gap-2 text-[13px] text-steel">
            <span>{week.subjects.join(" · ")}</span>
            <span>
              Target {week.targetPercent}% · Actual {week.actualPercent}% · {week.completed}/{week.total} topics
            </span>
          </span>
        </button>
        <div className="mt-2">
          <ProgressBar value={week.actualPercent} />
        </div>
      </div>
      {open && (
        <div className="border-t border-mist px-5 py-4">
          {week.goal && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {parseGoalGroups(week.goal).map((group, index) => (
                <div key={`${group.label ?? "group"}-${index}`} className="min-w-0">
                  {group.label && (
                    <p className="text-[10px] uppercase tracking-wide text-slate">{group.label}</p>
                  )}
                  <PointList points={group.points} size="md" columns={1} />
                </div>
              ))}
            </div>
          )}
          <ul className="mt-3 divide-y divide-mist">
            {week.topics.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="min-w-0 text-[15px] text-graphite">{t.name}</span>
                <span className="text-[13px] text-slate">
                  {t.subjectName} · {STATUS_LABEL[t.status]}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Link
              href={week.planlyHref}
              className="text-[13px] text-steel underline transition-colors hover:text-ember"
            >
              Open this week in Planly →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function GoalPlanner() {
  const [data, setData] = useState<GoalPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get<GoalPlanResponse>("/goal-plan");
    if (!res) {
      setError(true);
      setData(null);
    } else {
      setError(false);
      setData(res);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-64 rounded-buttons" />
        <div className="skeleton h-4 w-80 rounded-buttons" />
        <div className="skeleton h-40 rounded-cards" />
        <div className="skeleton h-64 rounded-cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="editorial-heading text-heading tracking-[-0.02em] text-graphite">Goal Planner</h1>
        <div className="mt-6 rounded-cards border border-mist bg-canvas p-6">
          <p className="text-[15px] text-graphite">Could not load the goal plan.</p>
          <p className="mt-1 text-[13px] text-steel">
            Check that the API is running at {API_URL} and the database is up.
          </p>
          <div className="mt-4">
            <Button onClick={load}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div>
        <p className="text-[13px] uppercase tracking-wide text-slate">Two-month plan</p>
        <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">Goal Planner</h1>
        <div className="mt-6 rounded-cards border border-mist bg-canvas p-6">
          <p className="text-[15px] text-graphite">No goal plan saved yet.</p>
          <p className="mt-1 text-[13px] text-steel">
            Run <code className="rounded-tags bg-fog px-1.5 py-0.5">pnpm prisma:seed</code> to create the
            two-month plan, subjects, weeks, and Planly tasks.
          </p>
        </div>
      </div>
    );
  }

  const { plan, summary, months, weeks } = data;
  const currentWeek =
    weeks.find((w) => new Date(w.startDate) <= new Date() && new Date(w.endDate) >= new Date()) ??
    weeks.find((w) => w.completed < w.total) ??
    weeks[weeks.length - 1];

  return (
    <div>
      <p className="text-[13px] uppercase tracking-wide text-slate">Two-month plan</p>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
        {plan.title}
      </h1>
      <p className="mt-2 text-[13px] text-steel">
        {formatRange(plan.startDate, plan.endDate)} · {plan.dailyStudyMinutes} min/day ·{" "}
        {weeks.length} weeks
      </p>

      {plan.strategy && (
        <p className="mt-3 max-w-3xl text-[15px] text-steel">{plan.strategy}</p>
      )}

      <div className="mt-8 rounded-cards border border-mist bg-canvas p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] uppercase tracking-wide text-slate">Overall progress</div>
            <div className="mt-1 font-display text-subheading font-light tracking-[-0.02em] text-graphite">
              {summary.percent}%
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-steel">
            <span>
              <span className="block text-[15px] text-graphite">{summary.completed}</span>
              Completed
            </span>
            <span>
              <span className="block text-[15px] text-graphite">{summary.inProgress}</span>
              In progress
            </span>
            <span>
              <span className="block text-[15px] text-graphite">{summary.remaining}</span>
              Remaining
            </span>
            <span>
              <span className="block text-[15px] text-graphite">
                {summary.weeksCompleted}/{summary.weeksTotal}
              </span>
              Weeks complete
            </span>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={summary.percent} />
        </div>
        <p className="mt-2 text-[13px] text-slate">
          Actual completion is read from saved topic progress. Planned coverage and weightage are planning
          estimates, shown separately.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {months.map((month) => (
          <MonthCard key={month.id} month={month} />
        ))}
      </div>

      <div className="mt-10 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
          Eight-week milestones
        </h2>
        {currentWeek && (
          <Link href={currentWeek.planlyHref} className="text-[13px] text-steel underline hover:text-ember">
            Current week in Planly →
          </Link>
        )}
      </div>
      <div className="mt-4 space-y-3">
        {weeks.map((w) => (
          <WeekCard key={w.id} week={w} defaultOpen={w.id === currentWeek?.id} />
        ))}
      </div>
    </div>
  );
}
