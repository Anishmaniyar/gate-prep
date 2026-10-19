"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { MOCK_PROFILE, MOCK_SUBJECTS, MOCK_TASKS, MOCK_REVISIONS } from "@/lib/mock";
import {
  daysUntil,
  formatShort,
  STREAK_EVENT,
  type DashboardData,
  type DashboardRevision,
  type StreakState,
} from "@/lib/dashboard";
import { Donut } from "@/components/Donut";
import { Heatmap } from "@/components/Heatmap";
import { TodayGoals } from "@/components/TodayGoals";
import { SubjectBars } from "@/components/SubjectBars";
import { ProfileSettings } from "@/components/ProfileSettings";
import { SectionCard, SampleBadge } from "@/components/ui";

function Stat({ label, value, hint }: { label: string; value: ReactNode; hint: string }) {
  return (
    <div className="bg-canvas px-4 py-3">
      <p className="text-[10px] uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-0.5 text-[19px] leading-tight text-graphite tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-steel">{hint}</p>
    </div>
  );
}

function RevisionList({
  revisions,
  busyId,
  onDone,
}: {
  revisions: DashboardRevision[];
  busyId: string | null;
  onDone: (id: string) => void;
}) {
  if (revisions.length === 0) {
    return <p className="text-[13px] text-steel">No revisions scheduled.</p>;
  }
  return (
    <ul className="divide-y divide-mist">
      {revisions.map((revision) => (
        <li key={revision.id} className="flex items-center gap-3 py-2.5">
          <div className="min-w-0 flex-1">
            <Link
              href={`/chapters/${revision.chapterId}`}
              className="block truncate text-[13px] text-graphite transition-colors duration-200 hover:text-ember"
            >
              {revision.topicName}
            </Link>
            <p className="mt-0.5 text-[11px] text-slate">
              {formatShort(revision.scheduledDate)} ·{" "}
              {revision.status === "OVERDUE" ? "overdue" : "pending"}
            </p>
          </div>
          <button
            onClick={() => onDone(revision.id)}
            disabled={busyId === revision.id}
            className="shrink-0 rounded-tags border border-mist-strong px-2 py-1 text-[10px] uppercase tracking-wide text-steel transition-colors duration-200 hover:border-graphite hover:text-graphite disabled:opacity-50"
          >
            {busyId === revision.id ? "Saving…" : "Mark done"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyRevision, setBusyRevision] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<DashboardData>("/dashboard");
    setData(res);
    setLoading(false);
    if (res) {
      const detail: StreakState = { streak: res.streak, activeToday: res.activeToday };
      window.dispatchEvent(new CustomEvent<StreakState>(STREAK_EVENT, { detail }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh when returning to the tab so tasks completed elsewhere show up.
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const completeRevision = async (id: string) => {
    setBusyRevision(id);
    await api.patch(`/revisions/${id}`, { status: "DONE" });
    setBusyRevision(null);
    load();
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton h-4 w-32 rounded-buttons" />
        <div className="skeleton mt-3 h-9 w-48 rounded-buttons" />
        <div className="skeleton mt-8 h-24 rounded-cards" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="skeleton h-64 rounded-cards lg:col-span-8" />
          <div className="skeleton h-64 rounded-cards lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <p className="text-[13px] uppercase tracking-wide text-slate">GATE 2027 · Computer Science</p>
        <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
          {MOCK_PROFILE.name}
        </h1>
        <p className="mt-2 text-[13px] text-steel">
          {MOCK_PROFILE.examTarget} · API offline — showing SAMPLE data.
          <SampleBadge />
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionCard title="Overall progress">
              <Donut percent={MOCK_PROFILE.overallPercent} completed={3} total={25} />
            </SectionCard>
          </div>
          <div className="lg:col-span-4">
            <SectionCard title="Today">
              <p className="text-[15px] text-steel">Start the API to load live preparation data.</p>
            </SectionCard>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-slate">
          Subjects: {MOCK_SUBJECTS.map((s) => s.name).join(", ")} · Tasks: {MOCK_TASKS.length} ·
          Revisions: {MOCK_REVISIONS.length}
        </p>
      </div>
    );
  }

  const { profile, overall, subjects, tasks, activity, streak, activeToday, revisions } = data;
  const remaining = daysUntil(profile.targetDate);
  const doneToday = tasks.filter((task) => task.status === "COMPLETED").length;
  const remainingMin = tasks
    .filter((task) => task.status !== "COMPLETED")
    .reduce((sum, task) => sum + task.estimatedMinutes, 0);

  const daysValue = remaining > 0 ? remaining : Math.abs(remaining);
  const daysHint = remaining > 0 ? "days remaining" : remaining === 0 ? "target is today" : "days past target";
  const streakHint = activeToday
    ? "Active today"
    : streak > 0
      ? "No activity yet today"
      : "Complete a task to start";

  return (
    <div>
      <p className="text-[13px] uppercase tracking-wide text-slate">{profile.examTarget}</p>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
        {profile.name}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-steel">
        <span>Target {formatShort(profile.targetDate)}</span>
        <span aria-hidden="true" className="text-faint">
          ·
        </span>
        <ProfileSettings profile={profile} onSaved={load} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-cards border border-mist bg-mist sm:grid-cols-3">
        <Stat
          label="Days to target"
          value={daysValue}
          hint={daysHint}
        />
        <Stat
          label="Today's goals"
          value={`${doneToday}/${tasks.length}`}
          hint={
            tasks.length === 0
              ? "No tasks scheduled"
              : remainingMin === 0
                ? "All done for today"
                : `${remainingMin} min remaining`
          }
        />
        <Stat
          label="Current streak"
          value={
            <>
              {streak}
              <span className="text-[12px] text-steel"> {streak === 1 ? "day" : "days"}</span>
            </>
          }
          hint={streakHint}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          <SectionCard title="Today's goals" actionHref="/planly" actionLabel="Planly →">
            <TodayGoals date={data.date} tasks={tasks} onChanged={load} />
          </SectionCard>
          <SectionCard title="Study activity">
            <Heatmap activity={activity} startIso={profile.startDate} targetIso={profile.targetDate} />
          </SectionCard>
        </div>

        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <SectionCard title="Overall progress" actionHref="/subjects" actionLabel="Syllabus →">
            <Donut percent={overall.percent} completed={overall.completed} total={overall.total} />
          </SectionCard>
          <SectionCard title="Upcoming revisions">
            <RevisionList
              revisions={revisions}
              busyId={busyRevision}
              onDone={completeRevision}
            />
          </SectionCard>
        </div>
      </div>

      <div className="mt-6">
        <SectionCard title="Subjects" actionHref="/subjects" actionLabel="View all →">
          <SubjectBars subjects={subjects} />
        </SectionCard>
      </div>
    </div>
  );
}
