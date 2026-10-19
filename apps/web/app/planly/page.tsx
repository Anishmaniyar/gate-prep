"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  PREVIEW_COMPLETED_KEY,
  PREVIEW_WEEKS,
  addDays,
  buildPreviewWeeks,
  buildWeeksFromTasks,
  dayScheduleNote,
  expectedOutcome,
  formatRange as formatDateRange,
  isoDay,
  mapApiTask,
  todayIso,
  type ApiTask,
  type PlannerDay,
  type PlannerStatus,
  type PlannerTask,
  type PlannerWeek,
  type WeekMeta,
} from "@/lib/planly";

type StudyPlan = {
  id: string;
  startDate: string;
  targetDate: string;
  _count?: { tasks: number };
};

type GoalWeekMeta = {
  weekNumber: number;
  startDate: string;
  endDate: string;
  title: string;
  goal: string | null;
};

type GoalPlanResponse = {
  plan: { startDate: string } | null;
  weeks: GoalWeekMeta[];
};

const STATUS_CLASS: Record<PlannerStatus, string> = {
  Completed:
    "border-[#4a7d5e]/40 bg-[#4a7d5e]/10 text-[#3f6d51] dark:border-[#7fae8d]/40 dark:bg-[#7fae8d]/10 dark:text-[#9cc9aa]",
  "In Progress":
    "border-[#5b8db8]/40 bg-[#5b8db8]/10 text-[#4a7ba3] dark:border-[#8fb8dd]/40 dark:bg-[#8fb8dd]/10 dark:text-[#a9c8e4]",
  Upcoming: "border-mist-strong bg-fog text-slate",
};

function StatusPill({ status }: { status: PlannerStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-tags border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_CLASS[status]}`}
    >
      {status}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 text-slate transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function NotesField({ task }: { task: PlannerTask }) {
  const storageKey = `axiom:planly:notes:${task.id}`;
  const [note, setNote] = useState(task.notes ?? "");
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNote(task.notes ?? "");
    setSaved(true);
  }, [task.id, task.notes]);

  const save = async () => {
    if (task.isPreview) {
      try {
        localStorage.setItem(storageKey, note);
        setSaved(true);
      } catch {
        setSaved(false);
      }
      return;
    }
    setBusy(true);
    const res = await api.patch(`/tasks/${task.id}`, { notes: note });
    setBusy(false);
    setSaved(Boolean(res));
  };

  return (
    <div className="sm:col-span-2">
      <label
        htmlFor={`notes-${task.id}`}
        className="block text-[10px] uppercase tracking-wide text-slate"
      >
        Notes / mistake log
      </label>
      <textarea
        id={`notes-${task.id}`}
        rows={3}
        value={note}
        disabled={busy}
        onChange={(event) => {
          setNote(event.target.value);
          setSaved(false);
        }}
        onBlur={save}
        placeholder="Write what you got wrong, why, and what to revisit."
        className="input-quiet mt-1 resize-y py-2 text-[13px]"
      />
      <p className="mt-1 text-[10px] text-slate">
        {busy
          ? "Saving…"
          : saved
            ? task.isPreview
              ? "Saved in this browser"
              : "Saved to your plan"
            : "Unsaved changes"}
      </p>
    </div>
  );
}

function TaskDetails({ task }: { task: PlannerTask }) {
  const pyqs = task.questions;
  return (
    <div className="mb-2 ml-6 rounded-buttons border border-mist bg-ash px-3 py-3">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Subject</dt>
          <dd className="text-graphite">{task.subject ?? "Not linked"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Chapter</dt>
          <dd className="text-graphite">{task.chapter ?? "Not linked"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Topic / subtopic</dt>
          <dd className="text-graphite">
            {task.topic ?? "Not linked"}
            {task.subtopic && <span className="block text-slate">{task.subtopic}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Outcome</dt>
          <dd className="text-graphite">{expectedOutcome(task)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] uppercase tracking-wide text-slate">Learning instructions</dt>
          <dd className="whitespace-pre-line text-graphite">
            {task.instructions ?? task.description ?? task.title}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Lecture / resource</dt>
          <dd className="text-graphite">
            {task.resource ? (
              <>
                {task.resource.url ? (
                  <a
                    href={task.resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-mist-strong underline-offset-2 hover:text-ember"
                  >
                    {task.resource.title}
                  </a>
                ) : (
                  task.resource.title
                )}
                {task.resource.isSample && <span className="ml-1 text-[10px] text-slate">SAMPLE</span>}
              </>
            ) : (
              <span className="text-steel">No verified lecture linked yet.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Practice</dt>
          <dd className="text-graphite">
            {task.practiceNotes
              ? task.practiceNotes
              : task.taskType === "PRACTICE"
                ? `Solve 10â€“15 questions on ${task.topic ?? "this topic"} and record mistakes.`
                : "No additional practice attached."}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] uppercase tracking-wide text-slate">PYQs</dt>
          <dd className="text-graphite">
            {pyqs.length > 0 ? (
              <span>
                {pyqs
                  .map((q) => q.sourceRef ?? (q.year ? `GATE ${q.year}` : "Linked question"))
                  .join(" Â· ")}
              </span>
            ) : task.pyqNotes ? (
              task.pyqNotes
            ) : task.taskType === "PYQ" ? (
              `Attempt relevant GATE previous-year questions on ${task.topic ?? "this topic"}.`
            ) : (
              <span className="text-steel">No PYQs linked to this task.</span>
            )}
          </dd>
        </div>
        <NotesField task={task} />
      </dl>
    </div>
  );
}

function TaskRow({
  task,
  open,
  busy,
  onToggle,
  onExpand,
}: {
  task: PlannerTask;
  open: boolean;
  busy: boolean;
  onToggle: (task: PlannerTask) => void;
  onExpand: () => void;
}) {
  const done = task.status === "COMPLETED";
  const status: PlannerStatus = done
    ? "Completed"
    : task.scheduledDate <= todayIso()
      ? "In Progress"
      : "Upcoming";
  return (
    <div className="border-t border-mist first:border-t-0">
      <div className="flex items-center gap-2 py-1.5">
        <input
          type="checkbox"
          checked={done}
          disabled={busy}
          onChange={() => onToggle(task)}
          aria-label={`Mark ${task.title} complete`}
          className="h-3.5 w-3.5 shrink-0 accent-[var(--graphite)]"
        />
        <button
          onClick={onExpand}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-buttons py-1 text-left"
        >
          <span className="shrink-0 rounded-tags border border-mist-strong bg-fog px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate">
            {task.label}
          </span>
          <span
            className={`min-w-0 flex-1 truncate text-[13px] ${
              done ? "text-steel line-through decoration-mist-strong" : "text-graphite"
            }`}
          >
            {task.title}
          </span>
          <span className="hidden shrink-0 text-[11px] text-slate sm:inline">
            Est. {task.estimatedMinutes}m
          </span>
          <StatusPill status={status} />
          <Chevron open={open} />
        </button>
      </div>
      {open && <TaskDetails task={task} />}
    </div>
  );
}

function DayRow({
  day,
  open,
  openTasks,
  busyTask,
  onToggleDay,
  onToggleTask,
  onExpandTask,
}: {
  day: PlannerDay;
  open: boolean;
  openTasks: Set<string>;
  busyTask: string | null;
  onToggleDay: () => void;
  onToggleTask: (task: PlannerTask) => void;
  onExpandTask: (id: string) => void;
}) {
  return (
    <div className="border-t border-mist first:border-t-0">
      <button
        onClick={onToggleDay}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 py-2 pl-4 pr-4 text-left transition-colors duration-200 hover:bg-fog"
      >
        <Chevron open={open} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] text-graphite">
            {day.dayLabel}
            {day.isSunday && (
              <span className="ml-2 rounded-tags bg-fog px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate">
                Buffer
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-[11px] text-slate">
            {dayScheduleNote(day)}
            {day.total > 0 && ` Â· ${day.completed}/${day.total} tasks`}
          </span>
        </span>
        <StatusPill status={day.status} />
      </button>

      {open && (
        <div className="pb-2 pl-10 pr-4">
          {day.tasks.length === 0 ? (
            <p className="py-2 text-[13px] text-steel">No tasks scheduled.</p>
          ) : (
            <div className="rounded-buttons border border-mist bg-canvas px-3">
              {day.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  open={openTasks.has(task.id)}
                  busy={busyTask === task.id}
                  onToggle={onToggleTask}
                  onExpand={() => onExpandTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WeekRow({
  week,
  open,
  openDays,
  openTasks,
  busyTask,
  onToggleWeek,
  onToggleDay,
  onToggleTask,
  onExpandTask,
}: {
  week: PlannerWeek;
  open: boolean;
  openDays: Set<string>;
  openTasks: Set<string>;
  busyTask: string | null;
  onToggleWeek: () => void;
  onToggleDay: (date: string) => void;
  onToggleTask: (task: PlannerTask) => void;
  onExpandTask: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-cards border border-mist bg-canvas">
      <div className="flex items-stretch">
        <button
          onClick={onToggleWeek}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-fog"
        >
          <Chevron open={open} />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[15px] font-medium text-graphite">Week {week.number}</span>
              <span className="text-[13px] text-steel">â€” {week.title}</span>
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate">
              <span>{formatDateRange(week.startDate, week.endDate)}</span>
              <span aria-hidden="true">Â·</span>
              <span>
                {week.studyDaysCompleted}/{week.studyDaysTotal} study days
              </span>
              <span aria-hidden="true">Â·</span>
              <span>
                {week.completed}/{week.total} tasks
              </span>
            </span>
          </span>
        </button>
        <div className="flex items-center pr-3">
          <StatusPill status={week.status} />
        </div>
      </div>

      {open && (
        <div className="border-t border-mist">
          <p className="px-4 py-2 text-[12px] leading-[1.54] text-steel">{week.goal}</p>
          <div className="border-t border-mist">
            {week.days.map((day) => (
              <DayRow
                key={day.key}
                day={day}
                open={openDays.has(day.key)}
                openTasks={openTasks}
                busyTask={busyTask}
                onToggleDay={() => onToggleDay(day.key)}
                onToggleTask={onToggleTask}
                onExpandTask={onExpandTask}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function currentWeekNumber(weeks: PlannerWeek[]) {
  const today = isoDay(new Date());
  return (
    weeks.find((week) => today >= week.startDate && today <= week.endDate)?.number ?? weeks[0]?.number ?? 1
  );
}

function readPreviewCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(PREVIEW_COMPLETED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((value): value is string => typeof value === "string"));
      }
    }
  } catch {
    /* ignore storage failures */
  }
  const seeded = new Set<string>();
  for (let index = 0; index < 5; index += 1) seeded.add(`preview-w1-d0-t${index}`);
  return seeded;
}

function PlanlyContent() {
  const params = useSearchParams();
  const requestedWeek = Number(params.get("week") ?? "");

  const [weeks, setWeeks] = useState<PlannerWeek[]>([]);
  const [preview, setPreview] = useState(false);
  const [previewDone, setPreviewDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busyTask, setBusyTask] = useState<string | null>(null);
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set());
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [openTasks, setOpenTasks] = useState<Set<string>>(new Set());
  const initialised = useRef(false);

  const load = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);

    const [plansRes, goalRes] = await Promise.all([
      api.get<{ plans: StudyPlan[] }>("/plans"),
      api.get<GoalPlanResponse>("/goal-plan"),
    ]);

    const plans = plansRes?.plans ?? [];
    const goalStart = goalRes?.plan?.startDate ? isoDay(goalRes.plan.startDate) : null;
    const plan =
      (goalStart ? plans.find((item) => isoDay(item.startDate) === goalStart) : undefined) ??
      plans.find((item) => (item._count?.tasks ?? 0) > 0) ??
      plans[0];

    const goalWeeks = goalRes?.weeks ?? [];
    const meta: WeekMeta[] =
      goalWeeks.length > 0
        ? goalWeeks
            .slice()
            .sort((a, b) => a.weekNumber - b.weekNumber)
            .map((week) => ({
              weekNumber: week.weekNumber,
              start: isoDay(week.startDate),
              end: isoDay(week.endDate),
              title: week.title,
              goal: week.goal ?? "",
            }))
        : PREVIEW_WEEKS;
    const lastWeek = meta[meta.length - 1];

    if (plan && lastWeek) {
      const planStart = isoDay(plan.startDate);
      const planTarget = isoDay(plan.targetDate);
      const from = planStart < lastWeek.start ? planStart : lastWeek.start;
      const to = planTarget > lastWeek.end ? planTarget : lastWeek.end;
      const tasksRes = await api.get<{ tasks: ApiTask[] }>(
        `/plans/${plan.id}/tasks?from=${from}&to=${to}`
      );

      if (tasksRes && tasksRes.tasks.length > 0) {
        setWeeks(buildWeeksFromTasks(meta, tasksRes.tasks.map(mapApiTask)));
        setPreview(false);
        setLoading(false);
        return;
      }
    }

    const done = readPreviewCompleted();
    setPreviewDone(done);
    setWeeks(buildPreviewWeeks(done));
    setPreview(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (loading || weeks.length === 0 || initialised.current) return;
    initialised.current = true;

    const requested =
      Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= weeks.length
        ? requestedWeek
        : currentWeekNumber(weeks);
    const active = weeks.find((week) => week.number === requested) ?? weeks[0];
    const today = isoDay(new Date());

    setOpenWeeks(new Set([active.number]));
    setOpenDays(new Set(active.days.filter((day) => day.date === today).map((day) => day.key)));
  }, [loading, weeks, requestedWeek]);

  const subjectStats = useMemo(() => {
    const map = new Map<string, { completed: number; total: number }>();
    for (const week of weeks) {
      for (const day of week.days) {
        for (const task of day.tasks) {
          if (!task.subject) continue;
          const stat = map.get(task.subject) ?? { completed: 0, total: 0 };
          stat.total += 1;
          if (task.status === "COMPLETED") stat.completed += 1;
          map.set(task.subject, stat);
        }
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [weeks]);

  const totals = useMemo(() => {
    const completed = weeks.reduce((sum, week) => sum + week.completed, 0);
    const total = weeks.reduce((sum, week) => sum + week.total, 0);
    const studyDone = weeks.reduce((sum, week) => sum + week.studyDaysCompleted, 0);
    const studyTotal = weeks.reduce((sum, week) => sum + week.studyDaysTotal, 0);
    return {
      completed,
      total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      studyDone,
      studyTotal,
    };
  }, [weeks]);

  const toggleWeek = (number: number) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
  };

  const toggleDay = (date: string) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const toggleTaskOpen = (id: string) => {
    setOpenTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTask = async (task: PlannerTask) => {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    if (task.isPreview) {
      const done = new Set(previewDone);
      if (nextStatus === "COMPLETED") done.add(task.id);
      else done.delete(task.id);
      setPreviewDone(done);
      try {
        localStorage.setItem(PREVIEW_COMPLETED_KEY, JSON.stringify(Array.from(done)));
      } catch {
        /* ignore storage failures */
      }
      setWeeks(buildPreviewWeeks(done));
      return;
    }

    setBusyTask(task.id);
    await api.patch(`/tasks/${task.id}`, { status: nextStatus });
    setBusyTask(null);
    await load(false);
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton h-9 w-40 rounded-buttons" />
        <div className="skeleton mt-3 h-4 w-72 rounded-buttons" />
        <div className="mt-7 space-y-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="skeleton h-14 rounded-cards" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] uppercase tracking-wide text-slate">Week â†’ day â†’ task</p>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">Planly</h1>
      <p className="mt-2 max-w-2xl text-[13px] text-steel">
        Eight weeks, seven days each, with every task kept independent. Expand a week, then a day,
        then a task for the full study brief.
      </p>

      {preview && (
        <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-tags border border-mist-strong bg-fog px-2.5 py-1 text-[11px] text-slate">
          <span className="rounded-tags bg-canvas px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-steel">
            Preview data
          </span>
          API or database unavailable â€” checkbox changes and notes are saved in this browser.
        </p>
      )}

      <div className="mt-6 rounded-cards border border-mist bg-canvas px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-steel">
          <span>
            <span className="text-graphite">
              {totals.completed}/{totals.total}
            </span>{" "}
            tasks complete
          </span>
          <span className="text-graphite">{totals.percent}%</span>
          <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-fog sm:block">
            <span
              className="block h-1.5 rounded-full bg-graphite transition-all duration-200"
              style={{ width: `${totals.percent}%` }}
            />
          </span>
          <span>
            <span className="text-graphite">
              {totals.studyDone}/{totals.studyTotal}
            </span>{" "}
            study days complete
          </span>
        </div>
        {subjectStats.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-mist pt-2.5">
            {subjectStats.map(([name, stat]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-tags border border-mist bg-ash px-2 py-0.5 text-[11px] text-steel"
              >
                {name}
                <span className="text-graphite">
                  {stat.completed}/{stat.total}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {weeks.map((week) => (
          <WeekRow
            key={week.number}
            week={week}
            open={openWeeks.has(week.number)}
            openDays={openDays}
            openTasks={openTasks}
            busyTask={busyTask}
            onToggleWeek={() => toggleWeek(week.number)}
            onToggleDay={toggleDay}
            onToggleTask={toggleTask}
            onExpandTask={toggleTaskOpen}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlanlyPage() {
  return (
    <Suspense fallback={<div className="skeleton h-40 rounded-cards" />}>
      <PlanlyContent />
    </Suspense>
  );
}
