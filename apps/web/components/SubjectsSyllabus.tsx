"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, API_URL } from "@/lib/api";
import {
  OFFICIAL_SYLLABUS_URL,
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  STATUS_DOT,
  STATUS_LABEL,
  STATUS_ORDER,
  STATUS_PILL,
  formatMinutes,
  formatShortDate,
  formatTaskDate,
  type PriorityValue,
  type SyllabusChapter,
  type SyllabusResponse,
  type SyllabusSubject,
  type SyllabusTopic,
  type TopicStatusValue,
} from "@/lib/syllabus";
import { Button, ProgressBar } from "@/components/ui";

const LAST_SUBJECT_KEY = "axiom:syllabus:last-subject";

function pad(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-[2px] bg-fog px-0.5 text-graphite">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function StatusPill({ status }: { status: TopicStatusValue }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-tags border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_PILL[status]}`}
    >
      {STATUS_LABEL[status]}
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

function StatusSelect({
  status,
  disabled,
  onChange,
}: {
  status: TopicStatusValue;
  disabled: boolean;
  onChange: (status: TopicStatusValue) => void;
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TopicStatusValue)}
      aria-label="Topic status"
      className="w-full rounded-buttons border border-mist-strong bg-canvas px-2 py-1 text-[13px] text-graphite disabled:opacity-50"
    >
      {STATUS_ORDER.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABEL[value]}
        </option>
      ))}
    </select>
  );
}

const STAT_ICONS: Record<string, ReactNode> = {
  subjects: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13V4Z" />
  ),
  chapters: (
    <>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </>
  ),
  topics: (
    <>
      <path d="M6 7h12M6 12h12M6 17h8" />
    </>
  ),
  completed: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  progress: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  revision: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 4v4h4" />
    </>
  ),
  notStarted: <circle cx="12" cy="12" r="8" />,
};

function StatCard({
  icon,
  label,
  value,
  percent,
}: {
  icon: keyof typeof STAT_ICONS;
  label: string;
  value: number | string;
  percent?: number;
}) {
  return (
    <div className="rounded-cards border border-mist bg-canvas px-3 py-3">
      <div className="flex items-center gap-2 text-slate">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          {STAT_ICONS[icon]}
        </svg>
        <span className="truncate text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-display text-[22px] font-light leading-none text-graphite">{value}</span>
        {percent !== undefined && <span className="text-[11px] text-slate">{percent}%</span>}
      </div>
    </div>
  );
}

function TopicDetails({
  topic,
  subject,
  chapter,
  index,
  draft,
  saving,
  autoFocusNotes,
  onDraft,
  onSaveNotes,
}: {
  topic: SyllabusTopic;
  subject: SyllabusSubject;
  chapter: SyllabusChapter;
  index: string;
  draft: string;
  saving: boolean;
  autoFocusNotes: boolean;
  onDraft: (value: string) => void;
  onSaveNotes: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (autoFocusNotes) textareaRef.current?.focus();
  }, [autoFocusNotes]);

  return (
    <div className="border-t border-mist bg-ash px-4 py-3">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-[13px] sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-[10px] uppercase tracking-wide text-slate">Description</dt>
          <dd className="text-graphite">
            {topic.description ?? (
              <span className="text-steel">No description stored for this topic.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Chapter · Subject</dt>
          <dd className="text-graphite">
            {chapter.name} · {subject.name}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Priority · Status</dt>
          <dd className="text-graphite">
            {PRIORITY_LABEL[topic.priority]} · {STATUS_LABEL[topic.status]}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Estimated study time</dt>
          <dd className="text-graphite">{formatMinutes(topic.estimatedMinutes) ?? "Not scheduled"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Last updated</dt>
          <dd className="text-graphite">{formatShortDate(topic.updatedAt)}</dd>
        </div>

        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Goal Planner milestone</dt>
          <dd className="text-graphite">
            {topic.milestones.length > 0 ? (
              topic.milestones.map((m) => (
                <span key={m.weekNumber} className="block">
                  Week {m.weekNumber} · {m.title}
                  <span className="block text-slate">
                    {formatTaskDate(m.startDate)} – {formatTaskDate(m.endDate)}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-steel">Not assigned to a goal milestone.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate">Resource links</dt>
          <dd className="text-graphite">
            {topic.resources.length > 0 ? (
              topic.resources.map((resource) => (
                <span key={resource.id} className="block">
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-mist-strong underline-offset-2 hover:text-ember"
                    >
                      {resource.title}
                    </a>
                  ) : (
                    resource.title
                  )}
                </span>
              ))
            ) : (
              <span className="text-steel">No verified resource linked.</span>
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] uppercase tracking-wide text-slate">Related Planly tasks</dt>
          <dd className="text-graphite">
            {topic.tasks.length > 0 ? (
              <ul className="space-y-1">
                {topic.tasks.map((task) => (
                  <li key={task.id} className="flex flex-wrap items-center gap-x-2">
                    <span className="min-w-0 flex-1 truncate">{task.title}</span>
                    <span className="text-slate">{formatTaskDate(task.scheduledDate)}</span>
                    <span className="text-slate">{STATUS_LABEL[task.status as TopicStatusValue] ?? task.status}</span>
                    {task.weekNumber && (
                      <a
                        href={`/planly?week=${task.weekNumber}`}
                        className="underline decoration-mist-strong underline-offset-2 hover:text-ember"
                      >
                        Planly W{task.weekNumber}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-steel">No Planly tasks reference this topic.</span>
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] uppercase tracking-wide text-slate">
            Personal notes · {index}
          </dt>
          <dd>
            <textarea
              ref={textareaRef}
              rows={3}
              value={draft}
              disabled={saving}
              onChange={(event) => onDraft(event.target.value)}
              placeholder="Write what you learned, what confused you, and what to revisit."
              className="input-quiet mt-1 resize-y py-2 text-[13px]"
            />
            <div className="mt-2 flex items-center gap-2">
              <Button size="sm" onClick={onSaveNotes} disabled={saving}>
                {saving ? "Saving…" : "Save Notes"}
              </Button>
              {topic.notes && <span className="text-[11px] text-slate">Last saved {formatShortDate(topic.updatedAt)}</span>}
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function SubjectsSyllabus() {
  const [data, setData] = useState<SyllabusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [view, setView] = useState<"list" | "tree">("list");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TopicStatusValue>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | PriorityValue>("all");

  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [focusNotes, setFocusNotes] = useState<string | null>(null);
  const [busyTopic, setBusyTopic] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const initialised = useRef(false);

  const load = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);
    const res = await api.get<SyllabusResponse>("/syllabus");
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

  // Default expansion: last subject the user opened, else the subject that
  // holds Discrete Mathematics. Chapters start collapsed except its first.
  useEffect(() => {
    if (!data || initialised.current) return;
    initialised.current = true;
    let slug = "";
    try {
      slug = localStorage.getItem(LAST_SUBJECT_KEY) ?? "";
    } catch {
      slug = "";
    }
    const target =
      data.subjects.find((s) => s.slug === slug) ??
      data.subjects.find((s) => s.slug === "discrete-mathematics") ??
      data.subjects[0];
    if (!target) return;
    setOpenSubjects(new Set([target.id]));
    const firstChapter = target.chapters[0];
    if (firstChapter) setOpenChapters(new Set([firstChapter.id]));
  }, [data]);

  const numberMap = useMemo(() => {
    const map = new Map<string, { s: number; c: number; t: number; chapter: string }>();
    data?.subjects.forEach((subject, si) => {
      subject.chapters.forEach((chapter, ci) => {
        map.set(chapter.id, { s: si + 1, c: ci + 1, t: 0, chapter: `${si + 1}.${ci + 1}` });
        chapter.topics.forEach((topic, ti) => {
          map.set(topic.id, { s: si + 1, c: ci + 1, t: ti + 1, chapter: `${si + 1}.${ci + 1}` });
        });
      });
    });
    return map;
  }, [data]);

  const q = search.trim();
  const filtersActive =
    q.length > 0 || subjectFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all";

  const filteredSubjects = useMemo(() => {
    const subjects = data?.subjects ?? [];
    const base = subjectFilter === "all" ? subjects : subjects.filter((s) => s.slug === subjectFilter);
    const needle = q.toLowerCase();
    const match = (value: string) => value.toLowerCase().includes(needle);
    return base
      .map((subject) => {
        const subjectMatch = !needle || match(subject.name);
        const chapters = subject.chapters
          .map((chapter) => {
            const chapterMatch = !needle || match(chapter.name);
            const topics = chapter.topics.filter((topic) => {
              const searchOk = !needle || subjectMatch || chapterMatch || match(topic.name);
              const statusOk = statusFilter === "all" || topic.status === statusFilter;
              const priorityOk = priorityFilter === "all" || topic.priority === priorityFilter;
              return searchOk && statusOk && priorityOk;
            });
            return { chapter, chapterMatch, topics };
          })
          .filter(({ chapterMatch, topics }) => {
            if (topics.length > 0) return true;
            return Boolean(needle) && chapterMatch && statusFilter === "all" && priorityFilter === "all";
          })
          .map(({ chapter, topics }) => ({ ...chapter, topics }));
        return { subject, chapters };
      })
      .filter(({ subject, chapters }) => {
        if (!filtersActive) return true;
        if (chapters.length > 0) return true;
        return subjectFilter === "all" && needle ? false : subjectFilter !== "all" && !needle;
      })
      .map((entry) => ({ ...entry.subject, chapters: entry.chapters }));
  }, [data, subjectFilter, q, statusFilter, priorityFilter, filtersActive]);

  const subjectOpen = useCallback(
    (subject: SyllabusSubject) =>
      openSubjects.has(subject.id) || (filtersActive && subject.chapters.length > 0),
    [openSubjects, filtersActive]
  );
  const chapterOpen = useCallback(
    (chapter: SyllabusChapter) =>
      openChapters.has(chapter.id) || (filtersActive && chapter.topics.length > 0),
    [openChapters, filtersActive]
  );

  const toggleSet = (setter: typeof setOpenSubjects) => (id: string) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSubject = (subject: SyllabusSubject) => {
    setOpenSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject.id)) {
        next.delete(subject.id);
      } else {
        next.add(subject.id);
        try {
          localStorage.setItem(LAST_SUBJECT_KEY, subject.slug);
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  };
  const toggleChapter = toggleSet(setOpenChapters);
  const toggleTopicDetails = (id: string) => {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setFocusNotes((prev) => (prev === id ? prev : null));
  };

  const expandAll = () => {
    setOpenSubjects(new Set(filteredSubjects.map((s) => s.id)));
    setOpenChapters(new Set(filteredSubjects.flatMap((s) => s.chapters.map((c) => c.id))));
  };
  const collapseAll = () => {
    setOpenSubjects(new Set());
    setOpenChapters(new Set());
  };
  const resetFilters = () => {
    setSearch("");
    setSubjectFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const applyStatus = async (topic: SyllabusTopic, status: TopicStatusValue) => {
    if (status === topic.status) return;
    setBusyTopic(topic.id);
    setActionError(null);
    const res = await api.patch(`/topics/${topic.id}/progress`, { status });
    setBusyTopic(null);
    if (!res) {
      setActionError("Could not update topic status. Is the API running?");
      return;
    }
    await load(false);
  };

  const toggleCheckbox = (topic: SyllabusTopic) => {
    applyStatus(topic, topic.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED");
  };

  const saveNotes = async (topic: SyllabusTopic) => {
    const notes = notesDraft[topic.id] ?? topic.notes ?? "";
    setSavingNotes(topic.id);
    setActionError(null);
    const res = await api.patch(`/topics/${topic.id}/notes`, { notes });
    setSavingNotes(null);
    if (!res) {
      setActionError("Could not save notes. Is the API running?");
      return;
    }
    setData((prev) =>
      prev
        ? {
            ...prev,
            subjects: prev.subjects.map((subject) => ({
              ...subject,
              chapters: subject.chapters.map((chapter) => ({
                ...chapter,
                topics: chapter.topics.map((t) =>
                  t.id === topic.id ? { ...t, notes, updatedAt: new Date().toISOString() } : t
                ),
              })),
            })),
          }
        : prev
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-9 w-72 rounded-buttons" />
        <div className="skeleton h-4 w-96 rounded-buttons" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="skeleton h-20 rounded-cards" />
          ))}
        </div>
        <div className="skeleton h-14 rounded-cards" />
        <div className="skeleton h-11 rounded-cards" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-14 rounded-cards" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <p className="text-[13px] uppercase tracking-wide text-slate">Syllabus</p>
        <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
          Subjects &amp; Syllabus
        </h1>
        <div className="mt-6 rounded-cards border border-mist bg-canvas p-6">
          <p className="text-[15px] text-graphite">Could not load the syllabus.</p>
          <p className="mt-1 text-[13px] text-steel">
            Check that the API is running at {API_URL} and the database is up.
          </p>
          <div className="mt-4">
            <Button onClick={() => load()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const { stats, overall } = data;

  return (
    <div>
      {/* ——— B. Page header ——— */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[13px] uppercase tracking-wide text-slate">Syllabus</p>
          <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
            Subjects &amp; Syllabus
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-steel">
            Complete GATE CS syllabus with chapter and topic tracking
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={OFFICIAL_SYLLABUS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-buttons border border-mist-strong bg-transparent px-4 text-[13px] font-medium text-graphite transition-colors duration-200 hover:bg-ash"
          >
            View Official Syllabus
          </a>
          <div className="inline-flex rounded-buttons border border-mist-strong p-0.5">
            {(["list", "tree"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`rounded-[5px] px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                  view === mode ? "bg-graphite text-canvas" : "text-steel hover:text-graphite"
                }`}
              >
                {mode === "list" ? "List View" : "Tree View"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ——— C. Summary statistics ——— */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
        <StatCard icon="subjects" label="Total Subjects" value={stats.subjects} />
        <StatCard icon="chapters" label="Total Chapters" value={stats.chapters} />
        <StatCard icon="topics" label="Total Topics" value={stats.topics} />
        <StatCard icon="completed" label="Completed" value={overall.completed} percent={overall.percent} />
        <StatCard icon="progress" label="In Progress" value={overall.inProgress} />
        <StatCard icon="revision" label="Needs Revision" value={overall.needsRevision} />
        <StatCard icon="notStarted" label="Not Started" value={overall.notStarted} />
      </div>

      {/* ——— D. Overall progress ——— */}
      <div className="mt-4 rounded-cards border border-mist bg-canvas px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
          <span className="text-steel">Overall Syllabus Progress</span>
          <span className="text-steel">
            <span className="text-graphite">{overall.completed}</span>/{overall.total} topics ·{" "}
            <span className="text-graphite">{overall.percent}%</span>
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={overall.percent} />
        </div>
      </div>

      {/* ——— E. Search and filters toolbar ——— */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-cards border border-mist bg-canvas p-2.5">
        <div className="relative min-w-[12rem] flex-1">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search subjects, chapters, topics…"
            aria-label="Search syllabus"
            className="w-full rounded-buttons border border-mist-strong bg-canvas px-3 py-1.5 text-[13px] text-graphite"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          aria-label="Filter by subject"
          className="rounded-buttons border border-mist-strong bg-canvas px-2.5 py-1.5 text-[13px] text-graphite"
        >
          <option value="all">All Subjects</option>
          {data.subjects.map((subject) => (
            <option key={subject.id} value={subject.slug}>
              {subject.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | TopicStatusValue)}
          aria-label="Filter by status"
          className="rounded-buttons border border-mist-strong bg-canvas px-2.5 py-1.5 text-[13px] text-graphite"
        >
          <option value="all">All Statuses</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as "all" | PriorityValue)}
          aria-label="Filter by priority"
          className="rounded-buttons border border-mist-strong bg-canvas px-2.5 py-1.5 text-[13px] text-graphite"
        >
          <option value="all">All Priorities</option>
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABEL[priority]}
            </option>
          ))}
        </select>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {actionError && <p className="mt-2 text-[13px] text-danger">{actionError}</p>}

      {/* ——— G. Tree view ——— */}
      {view === "tree" ? (
        <div className="mt-4 space-y-2">
          {filteredSubjects.length === 0 ? (
            <p className="rounded-cards border border-mist bg-canvas px-4 py-6 text-center text-[13px] text-steel">
              No subjects or topics match the current filters.
            </p>
          ) : (
            filteredSubjects.map((subject) => {
              const num = numberMap.get(subject.chapters[0]?.id ?? "")?.s ?? 1;
              return (
                <div key={subject.id} className="rounded-cards border border-mist bg-canvas px-4 py-3">
                  <div className="flex items-center gap-2 text-[15px] text-graphite">
                    <span className="text-slate">{pad(num)}</span>
                    {highlight(subject.name, q)}
                    <span className="text-[11px] text-slate">{subject.topicCount} topics</span>
                  </div>
                  <ul className="mt-1.5 ml-3 border-l border-mist pl-4">
                    {subject.chapters.map((chapter) => (
                      <li key={chapter.id} className="py-1">
                        <div className="text-[13px] text-steel">
                          └─ {highlight(chapter.name, q)}{" "}
                          <span className="text-[11px] text-slate">({chapter.topics.length})</span>
                        </div>
                        <ul className="ml-4 mt-0.5 space-y-0.5">
                          {chapter.topics.map((topic) => (
                            <li key={topic.id} className="flex items-center gap-2 text-[13px] text-graphite">
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[topic.status]}`} />
                              <span className="min-w-0 flex-1 truncate">
                                ·─ {highlight(topic.name, q)}
                              </span>
                              <span className="text-[11px] text-slate">{STATUS_LABEL[topic.status]}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ——— 2./3./4. List view: subject → chapter → topic table ——— */
        <div className="mt-4 space-y-2">
          {filteredSubjects.length === 0 ? (
            <p className="rounded-cards border border-mist bg-canvas px-4 py-6 text-center text-[13px] text-steel">
              No subjects or topics match the current filters.
            </p>
          ) : (
            filteredSubjects.map((subject) => {
              const sOpen = subjectOpen(subject);
              const subjectNumber = numberMap.get(subject.chapters[0]?.id ?? "")?.s ?? 1;
              return (
                <section key={subject.id} className="overflow-hidden rounded-cards border border-mist bg-canvas">
                  <div className="flex items-stretch">
                    <button
                      onClick={() => toggleSubject(subject)}
                      aria-expanded={sOpen}
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-fog"
                    >
                      <Chevron open={sOpen} />
                      <span className="shrink-0 font-display text-[15px] font-light text-slate">
                        {pad(subjectNumber)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] text-graphite">
                          {highlight(subject.name, q)}
                          {subject.isSample && (
                            <span className="ml-2 inline-block rounded-tags bg-fog px-1.5 py-0.5 align-middle text-[10px] text-steel">
                              SAMPLE
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-slate">
                          <span>{subject.chapterCount} Chapters</span>
                          <span aria-hidden="true">·</span>
                          <span>{subject.topicCount} Topics</span>
                        </span>
                      </span>
                      <span className="hidden w-32 shrink-0 sm:block">
                        <ProgressBar value={subject.progress.percent} />
                      </span>
                      <span className="shrink-0 text-right text-[11px] text-steel">
                        <span className="text-[13px] text-graphite">{subject.progress.percent}%</span>
                        <span className="block">
                          {subject.progress.completed}/{subject.progress.total}
                        </span>
                      </span>
                    </button>
                  </div>

                  {sOpen && (
                    <div className="border-t border-mist">
                      {subject.chapters.length === 0 ? (
                        <p className="px-6 py-3 text-[13px] text-steel">No chapters match.</p>
                      ) : (
                        subject.chapters.map((chapter) => {
                          const cOpen = chapterOpen(chapter);
                          const chapterNumber =
                            numberMap.get(chapter.id)?.chapter ?? `${subjectNumber}.1`;
                          return (
                            <div key={chapter.id} className="border-t border-mist first:border-t-0">
                              <button
                                onClick={() => toggleChapter(chapter.id)}
                                aria-expanded={cOpen}
                                className="flex w-full items-center gap-3 py-2.5 pl-9 pr-4 text-left transition-colors duration-200 hover:bg-fog"
                              >
                                <Chevron open={cOpen} />
                                <span className="shrink-0 text-[13px] text-slate">{chapterNumber}</span>
                                <span className="min-w-0 flex-1 truncate text-[15px] text-graphite">
                                  {highlight(chapter.name, q)}
                                </span>
                                <span className="hidden shrink-0 text-[11px] text-slate md:inline">
                                  {chapter.topicCount} Topics
                                </span>
                                <span className="hidden w-24 shrink-0 md:block">
                                  <ProgressBar value={chapter.progress.percent} />
                                </span>
                                <span className="shrink-0 text-right text-[11px] text-steel">
                                  <span className="text-[13px] text-graphite">
                                    {chapter.progress.percent}%
                                  </span>
                                  <span className="block">
                                    {chapter.progress.completed}/{chapter.progress.total}
                                  </span>
                                </span>
                              </button>

                              {cOpen && (
                                <div className="bg-canvas pb-2 pl-6 pr-3">
                                  {chapter.topics.length === 0 ? (
                                    <p className="px-3 py-2 text-[13px] text-steel">
                                      No topics match the current filters.
                                    </p>
                                  ) : (
                                    <div className="overflow-hidden rounded-buttons border border-mist">
                                      <div className="hidden grid-cols-[1.25rem_3.5rem_minmax(0,1fr)_4.5rem_9.5rem_2.25rem_3.5rem_1.25rem] items-center gap-2 border-b border-mist bg-ash px-3 py-1.5 text-[10px] uppercase tracking-wide text-slate md:grid">
                                        <span />
                                        <span>ID</span>
                                        <span>Topic</span>
                                        <span>Priority</span>
                                        <span>Status</span>
                                        <span className="text-center">Notes</span>
                                        <span>Time</span>
                                        <span />
                                      </div>
                                      {chapter.topics.map((topic) => {
                                        const ident = numberMap.get(topic.id);
                                        const topicIndex = ident
                                          ? `${ident.s}.${ident.c}.${ident.t}`
                                          : "";
                                        const detailsOpen = openTopics.has(topic.id);
                                        const hasNotes = Boolean((topic.notes ?? "").trim());
                                        const time = formatMinutes(topic.estimatedMinutes);
                                        return (
                                          <div key={topic.id} className="border-t border-mist first:border-t-0">
                                            {/* Desktop row */}
                                            <div className="hidden grid-cols-[1.25rem_3.5rem_minmax(0,1fr)_4.5rem_9.5rem_2.25rem_3.5rem_1.25rem] items-center gap-2 px-3 py-1.5 md:grid">
                                              <input
                                                type="checkbox"
                                                checked={topic.status === "COMPLETED"}
                                                disabled={busyTopic === topic.id}
                                                onChange={() => toggleCheckbox(topic)}
                                                aria-label={`Mark ${topic.name} complete`}
                                                className="h-3.5 w-3.5 accent-[var(--graphite)]"
                                              />
                                              <span className="text-[11px] text-slate">{topicIndex}</span>
                                              <button
                                                onClick={() => toggleTopicDetails(topic.id)}
                                                className="min-w-0 truncate text-left text-[13px] text-graphite hover:text-ember"
                                              >
                                                {highlight(topic.name, q)}
                                              </button>
                                              <span className="text-[13px] text-steel">
                                                {PRIORITY_LABEL[topic.priority]}
                                              </span>
                                              <StatusSelect
                                                status={topic.status}
                                                disabled={busyTopic === topic.id}
                                                onChange={(value) => applyStatus(topic, value)}
                                              />
                                              <button
                                                onClick={() => {
                                                  toggleTopicDetails(topic.id);
                                                  setFocusNotes(topic.id);
                                                }}
                                                title={hasNotes ? "Notes saved — open" : "Add notes"}
                                                aria-label={`Notes for ${topic.name}`}
                                                className={`flex h-6 w-6 items-center justify-center rounded-buttons hover:bg-fog ${
                                                  hasNotes ? "text-ember" : "text-slate"
                                                }`}
                                              >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                  <path d="M4 5h16v11H8l-4 4z" />
                                                </svg>
                                              </button>
                                              <span className="text-[11px] text-slate">{time ?? "—"}</span>
                                              <button
                                                onClick={() => toggleTopicDetails(topic.id)}
                                                aria-expanded={detailsOpen}
                                                aria-label={`Details for ${topic.name}`}
                                                className="flex items-center justify-center rounded-buttons py-1 hover:bg-fog"
                                              >
                                                <Chevron open={detailsOpen} />
                                              </button>
                                            </div>

                                            {/* Mobile row */}
                                            <div className="md:hidden">
                                              <div className="flex items-start gap-2 px-3 py-2">
                                                <input
                                                  type="checkbox"
                                                  checked={topic.status === "COMPLETED"}
                                                  disabled={busyTopic === topic.id}
                                                  onChange={() => toggleCheckbox(topic)}
                                                  aria-label={`Mark ${topic.name} complete`}
                                                  className="mt-1 h-3.5 w-3.5 shrink-0 accent-[var(--graphite)]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                  <button
                                                    onClick={() => toggleTopicDetails(topic.id)}
                                                    className="flex w-full items-center gap-2 text-left"
                                                  >
                                                    <span className="min-w-0 flex-1 text-[13px] text-graphite">
                                                      {highlight(topic.name, q)}
                                                    </span>
                                                    <StatusPill status={topic.status} />
                                                    <Chevron open={detailsOpen} />
                                                  </button>
                                                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate">
                                                    <span>{topicIndex}</span>
                                                    <span>{PRIORITY_LABEL[topic.priority]}</span>
                                                    {time && <span>{time}</span>}
                                                    {hasNotes && <span className="text-ember">Notes</span>}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {detailsOpen && (
                                              <TopicDetails
                                                topic={topic}
                                                subject={subject}
                                                chapter={chapter}
                                                index={topicIndex}
                                                draft={notesDraft[topic.id] ?? topic.notes ?? ""}
                                                saving={savingNotes === topic.id}
                                                autoFocusNotes={focusNotes === topic.id}
                                                onDraft={(value) =>
                                                  setNotesDraft((prev) => ({ ...prev, [topic.id]: value }))
                                                }
                                                onSaveNotes={() => saveNotes(topic)}
                                              />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
