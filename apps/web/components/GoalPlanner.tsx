"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  COVERAGE_LABEL,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type GoalChapter,
  type GoalPlanResponse,
  type GoalSubject,
  type GoalTopic,
  type GoalWeek,
  type TopicStatus,
} from "@/lib/goalPlan";
import { Button, Chip, Modal, ProgressBar, SectionCard } from "@/components/ui";

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

function isoDay(iso: string | null) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}

function StatusSelect({
  topic,
  onChanged,
}: {
  topic: GoalTopic;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  if (!topic.topicId) {
    return <span className="text-[13px] text-slate">No linked syllabus topic</span>;
  }
  const update = async (status: TopicStatus) => {
    setBusy(true);
    await api.patch(`/topics/${topic.topicId}/progress`, { status });
    setBusy(false);
    onChanged();
  };
  return (
    <select
      value={topic.status}
      disabled={busy}
      onChange={(e) => update(e.target.value as TopicStatus)}
      aria-label={`Status for ${topic.name}`}
      className="rounded-buttons border border-mist-strong bg-canvas px-2 py-1 text-[13px] text-graphite disabled:opacity-50"
    >
      {(Object.keys(STATUS_LABEL) as TopicStatus[]).map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

function TopicRow({
  topic,
  onChanged,
  onEdit,
}: {
  topic: GoalTopic;
  onChanged: () => void;
  onEdit: (topic: GoalTopic) => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-2 py-2.5">
      <span className="min-w-0 flex-1 text-[15px] text-graphite">{topic.name}</span>
      <span className="text-[13px] text-steel">{PRIORITY_LABEL[topic.priority]}</span>
      <span className="text-[13px] text-slate">{COVERAGE_LABEL[topic.coverage]}</span>
      {topic.plannedStart && topic.plannedEnd && (
        <span className="text-[13px] text-slate">
          {formatRange(topic.plannedStart, topic.plannedEnd)}
        </span>
      )}
      <StatusSelect topic={topic} onChanged={onChanged} />
      <Button variant="ghost" size="sm" onClick={() => onEdit(topic)} aria-label={`Edit plan for ${topic.name}`}>
        Edit
      </Button>
    </li>
  );
}

function ChapterBlock({
  chapter,
  onChanged,
  onEdit,
}: {
  chapter: GoalChapter;
  onChanged: () => void;
  onEdit: (topic: GoalTopic) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-[15px] font-medium text-graphite">{chapter.name}</h4>
        <span className="text-[13px] text-slate">{PRIORITY_LABEL[chapter.priority]}</span>
      </div>
      <ul className="mt-1 divide-y divide-mist">
        {chapter.topics.map((t) => (
          <TopicRow key={t.id} topic={t} onChanged={onChanged} onEdit={onEdit} />
        ))}
      </ul>
    </div>
  );
}

function SubjectCard({
  subject,
  onChanged,
}: {
  subject: GoalSubject;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GoalTopic | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ coverage: "CORE", plannedStart: "", plannedEnd: "" });

  const startEdit = (topic: GoalTopic) => {
    setEditing(topic);
    setForm({
      coverage: topic.coverage,
      plannedStart: isoDay(topic.plannedStart),
      plannedEnd: isoDay(topic.plannedEnd),
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    await api.patch(`/goal-topics/${editing.id}`, {
      coverage: form.coverage,
      plannedStart: form.plannedStart ? new Date(form.plannedStart + "T00:00:00.000Z").toISOString() : null,
      plannedEnd: form.plannedEnd ? new Date(form.plannedEnd + "T00:00:00.000Z").toISOString() : null,
    });
    setSaving(false);
    setEditing(null);
    onChanged();
  };

  return (
    <section className="rounded-cards border border-mist bg-canvas p-6 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
          {subject.name}
        </h3>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${subject.name}`}
          className="rounded-buttons px-2 py-1 text-[13px] text-slate transition-colors duration-200 hover:bg-fog hover:text-graphite"
        >
          {open ? "Collapse −" : "Expand +"}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip label="Priority" count={PRIORITY_LABEL[subject.priority]} />
        <Chip label="Planned coverage" count={`${subject.plannedCoverage}%`} />
        <Chip label="Actual" count={`${subject.progress.percent}%`} />
        {subject.weightageEstimate !== null && (
          <Chip label="Est. weightage" count={`~${subject.weightageEstimate}%`} />
        )}
      </div>
      <div className="mt-3">
        <ProgressBar value={subject.progress.percent} />
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-2 text-[13px] text-steel">
        <span>
          {subject.progress.completed}/{subject.progress.total} topics completed ·{" "}
          {subject.progress.inProgress} in progress
        </span>
        {subject.weightageEstimate !== null && (
          <span title={subject.weightageSource ?? undefined}>
            Estimate only — not an official GATE 2027 distribution
          </span>
        )}
      </div>

      {open && (
        <div className="mt-5 border-t border-mist pt-2">
          {subject.chapters.map((c) => (
            <ChapterBlock key={c.id} chapter={c} onChanged={onChanged} onEdit={startEdit} />
          ))}
        </div>
      )}

      {editing && (
        <Modal label={`Edit plan for ${editing.name}`} onClose={() => setEditing(null)}>
          <h2 className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
            {editing.name}
          </h2>
          <p className="mt-1 text-[13px] text-steel">
            Planned coverage and target dates are planning data. Completion stays separate.
          </p>
          <div className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-[13px] text-steel" htmlFor="gp-coverage">
                Planned coverage
              </label>
              <select
                id="gp-coverage"
                className="input-quiet"
                value={form.coverage}
                onChange={(e) => setForm({ ...form, coverage: e.target.value })}
              >
                <option value="CORE">Core</option>
                <option value="SUPPORTING">Supporting</option>
                <option value="OPTIONAL">Optional</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[13px] text-steel" htmlFor="gp-start">
                  Target start
                </label>
                <input
                  id="gp-start"
                  type="date"
                  className="input-quiet"
                  value={form.plannedStart}
                  onChange={(e) => setForm({ ...form, plannedStart: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] text-steel" htmlFor="gp-end">
                  Target end
                </label>
                <input
                  id="gp-end"
                  type="date"
                  className="input-quiet"
                  value={form.plannedEnd}
                  onChange={(e) => setForm({ ...form, plannedEnd: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </section>
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
          {week.goal && <p className="text-[15px] text-steel">{week.goal}</p>}
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
            Check that the API is running at {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"} and
            the database is up.
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

  const { plan, summary, subjects, months, weeks } = data;
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {months.map((m) => (
          <SectionCard key={m.id} title={m.title}>
            <div className="text-[13px] text-steel">{formatRange(m.startDate, m.endDate)}</div>
            {m.goal && <p className="mt-2 text-[15px] text-graphite">{m.goal}</p>}
            <div className="mt-3">
              <ProgressBar value={m.progress.percent} />
            </div>
            <div className="mt-1.5 flex justify-between text-[13px] text-steel">
              <span>
                {m.progress.completed}/{m.progress.total} topics · {m.weeksCompleted}/{m.weeksTotal} weeks
              </span>
              <span>{m.progress.percent}%</span>
            </div>
            <ul className="mt-4 space-y-2">
              {m.subjects.map((s) => (
                <li key={s.id} className="text-[13px]">
                  <span className="text-graphite">{s.name}</span>{" "}
                  <span className="text-slate">· {PRIORITY_LABEL[s.priority]}</span>
                  {s.focus && <div className="text-steel">{s.focus}</div>}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>

      <h2 className="mt-10 font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
        Subject tracks
      </h2>
      <p className="mt-1 text-[13px] text-steel">
        Expand a subject to see chapters and topics. Weightage is a labelled historical estimate, not official
        GATE 2027 data.
      </p>
      <div className="mt-4 space-y-4">
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} onChanged={load} />
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
