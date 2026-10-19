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
import { SectionCard, SampleBadge, Chip } from "@/components/ui";

function HeroNumber({ value, caption }: { value: string; caption: string }) {
  return (
    <div>
      <div className="font-display text-heading font-light tracking-[-0.02em] text-graphite">
        {value}
      </div>
      <div className="mt-1 text-[13px] text-steel">{caption}</div>
    </div>
  );
}

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
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-48 rounded-buttons" />
        <div className="skeleton h-4 w-72 rounded-buttons" />
        <div className="skeleton h-44 rounded-cards" />
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
          {MOCK_PROFILE.examTarget} · API offline — showing SAMPLE data.<SampleBadge />
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

  const { profile, overall, subjects, tasks, activity, streak, revisions } = data;
  const remaining = daysUntil(profile.targetDate);
  const countdown =
    remaining > 0 ? `${remaining} day${remaining === 1 ? "" : "s"} remaining` : remaining === 0 ? "Target day is today" : `Target passed ${-remaining} day${remaining === -1 ? "" : "s"} ago`;

  return (
    <div>
      {/* Hero — editorial serif, one ember stat */}
      <p className="text-[13px] uppercase tracking-wide text-slate">{profile.examTarget}</p>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
        {profile.name}
      </h1>
      <p className="mt-2 text-[13px] text-steel">
        Target {formatShort(profile.targetDate)} · {countdown} ·{" "}
        <span className="text-ember">{streak}-day streak</span>
      </p>
      <div className="mt-1">
        <ProfileSettings profile={profile} onSaved={load} />
      </div>

      {/* Hero numbers */}
      <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
        <HeroNumber value={`${overall.percent}%`} caption={`Syllabus · ${overall.completed}/${overall.total} topics`} />
        <HeroNumber value={`${remaining > 0 ? remaining : 0}`} caption="Days to target" />
        <HeroNumber value={`${tasks.filter((t) => t.status === "COMPLETED").length}/${tasks.length}`} caption="Today's goals done" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <SectionCard title="Overall progress" actionHref="/subjects" actionLabel="Syllabus →">
            <Donut percent={overall.percent} completed={overall.completed} total={overall.total} />
          </SectionCard>
          <SectionCard title="Study activity">
            <Heatmap activity={activity} startIso={profile.startDate} targetIso={profile.targetDate} />
          </SectionCard>
          <SectionCard title="Upcoming revisions">
            {revisions.length === 0 ? (
              <p className="text-[15px] text-steel">No revisions scheduled.</p>
            ) : (
              <ul className="divide-y divide-mist">
                {revisions.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                    <Link href={`/chapters/${r.chapterId}`} className="truncate text-[15px] text-graphite hover:underline">
                      {r.topicName}
                    </Link>
                    <span className="whitespace-nowrap text-[13px] text-steel">
                      {formatShort(r.scheduledDate)} · {r.status === "OVERDUE" ? "overdue" : "pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <SectionCard title="Today's goals" actionHref="/planly" actionLabel="Planly →">
            <TodayGoals date={data.date} tasks={tasks} onChanged={load} />
          </SectionCard>
          <SectionCard title="Subjects" actionHref="/subjects" actionLabel="View all →">
            <SubjectBars subjects={subjects} />
          </SectionCard>
          <div className="flex flex-wrap gap-2">
            <Chip label="GATE 2027" count="CS" />
            <Chip label="Target" count={formatShort(profile.targetDate)} />
          </div>
        </div>
      </div>
    </div>
  );
}
