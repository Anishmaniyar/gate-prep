"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MOCK_PROFILE, MOCK_SUBJECTS, MOCK_TASKS, MOCK_REVISIONS } from "@/lib/mock";
import {
  daysUntil,
  formatShort,
  type DashboardData,
} from "@/lib/dashboard";
import { Donut } from "@/components/Donut";
import { Heatmap } from "@/components/Heatmap";
import { TodayGoals } from "@/components/TodayGoals";
import { SubjectBars } from "@/components/SubjectBars";
import { ProfileSettings } from "@/components/ProfileSettings";
import { Card, SampleBadge, SectionTitle } from "@/components/ui";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await api.get<DashboardData>("/dashboard");
    setData(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading workspace…</p>;
  }

  // Temporary clearly-identified fallback when the API is unreachable.
  // Shapes mirror DashboardData so the same components render.
  if (!data) {
    return (
      <div>
        <h1 className="text-xl font-medium text-neutral-100">{MOCK_PROFILE.name}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {MOCK_PROFILE.examTarget} · API offline — showing SAMPLE data.<SampleBadge />
        </p>
        <SectionTitle>Overall progress</SectionTitle>
        <Card>
          <Donut percent={MOCK_PROFILE.overallPercent} completed={3} total={25} />
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 items-start">
          <TodayGoals date={new Date().toISOString().slice(0, 10)} tasks={[]} onChanged={() => {}} />
          <SubjectBars subjects={[]} />
        </div>
        <p className="text-xs text-neutral-600 mt-4">
          Start the API (<code>pnpm dev:api</code>) to load live preparation data. Subjects:{" "}
          {MOCK_SUBJECTS.map((s) => s.name).join(", ")} · Tasks: {MOCK_TASKS.length} · Revisions: {MOCK_REVISIONS.length}
        </p>
      </div>
    );
  }

  const { profile, overall, subjects, tasks, activity, streak, revisions } = data;
  const remaining = daysUntil(profile.targetDate);
  const countdown =
    remaining > 0 ? `${remaining} day${remaining === 1 ? "" : "s"} remaining` : remaining === 0 ? "Target day is today" : `Target passed ${-remaining} day${remaining === -1 ? "" : "s"} ago`;

  return (
    <div>
      {/* A. Personal header — name first */}
      <h1 className="text-xl font-medium text-neutral-100">{profile.name}</h1>
      <p className="text-sm text-neutral-400 mt-1">{profile.examTarget}</p>
      <p className="text-sm text-neutral-500 mt-1">
        Target {formatShort(profile.targetDate)} · {countdown} · {streak}-day streak
      </p>
      <div className="mt-1">
        <ProfileSettings profile={profile} onSaved={load} />
      </div>

      {/* B. Overall progress donut */}
      <SectionTitle>Overall progress</SectionTitle>
      <Card>
        <Donut percent={overall.percent} completed={overall.completed} total={overall.total} />
      </Card>

      {/* C. Activity heatmap */}
      <SectionTitle>Study activity</SectionTitle>
      <Card>
        <Heatmap activity={activity} startIso={profile.startDate} targetIso={profile.targetDate} />
      </Card>

      {/* D. Two-column: Today's Goals + Subject analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 items-start">
        <TodayGoals date={data.date} tasks={tasks} onChanged={load} />
        <SubjectBars subjects={subjects} />
      </div>

      {/* E. Upcoming revisions — compact */}
      <SectionTitle>Upcoming revisions</SectionTitle>
      {revisions.length === 0 ? (
        <p className="text-sm text-neutral-500">No revisions scheduled.</p>
      ) : (
        <ul className="border border-neutral-800 rounded divide-y divide-neutral-800">
          {revisions.map((r) => (
            <li key={r.id} className="px-3 py-2 text-sm flex items-center justify-between gap-3">
              <Link href={`/chapters/${r.chapterId}`} className="text-neutral-200 truncate hover:underline">
                {r.topicName}
              </Link>
              <span className="text-xs text-neutral-500 whitespace-nowrap">
                {formatShort(r.scheduledDate)} · {r.status === "OVERDUE" ? "overdue" : "pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
