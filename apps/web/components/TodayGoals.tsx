"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { formatDay, TASK_TYPE_LABEL, type DashboardTask } from "@/lib/dashboard";
import { SampleBadge } from "@/components/ui";

function taskLink(t: DashboardTask): { href: string; label: string } | null {
  if (t.resource?.url) return { href: t.resource.url, label: t.resource.title };
  if (t.topic) return { href: `/chapters/${t.topic.chapterId}`, label: t.topic.name };
  return null;
}

export function TodayGoals({
  date,
  tasks,
  onChanged,
}: {
  date: string;
  tasks: DashboardTask[];
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const done = tasks.filter((t) => t.status === "COMPLETED").length;
  const remainingMin = tasks
    .filter((t) => t.status !== "COMPLETED")
    .reduce((s, t) => s + t.estimatedMinutes, 0);

  const toggle = async (t: DashboardTask, checked: boolean) => {
    setBusy(t.id);
    await api.patch(`/tasks/${t.id}`, { status: checked ? "COMPLETED" : "PENDING" });
    setBusy(null);
    onChanged();
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[13px] text-steel">{formatDay(date)}</div>
        <div className="whitespace-nowrap text-[13px] text-slate tabular-nums">
          {done}/{tasks.length} done
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-fog" role="progressbar" aria-valuenow={tasks.length ? Math.round((done / tasks.length) * 100) : 0}>
          <div
            className="h-1.5 rounded-full bg-graphite transition-all duration-200 ease-out"
            style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="mt-3 text-[15px] text-steel">
          No tasks assigned for today. Add some in{" "}
          <Link href="/planly" className="underline transition-colors hover:text-ember">
            Planly
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-mist">
          {tasks.map((t) => {
            const link = taskLink(t);
            return (
              <li key={t.id} className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  checked={t.status === "COMPLETED"}
                  disabled={busy === t.id}
                  onChange={(e) => toggle(t, e.target.checked)}
                  aria-label={`Mark task ${t.title} complete`}
                  className="mt-1 accent-[var(--graphite)]"
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-[15px] ${t.status === "COMPLETED" ? "text-slate line-through" : "text-graphite"}`}>
                    {t.title}
                  </div>
                  <div className="mt-0.5 text-[13px] text-steel">
                    {TASK_TYPE_LABEL[t.taskType]} · {t.estimatedMinutes} min
                    {link && (
                      <>
                        {" · "}
                        {link.href.startsWith("http") ? (
                          <a href={link.href} target="_blank" rel="noreferrer" className="underline hover:text-ember">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className="underline hover:text-ember">
                            {link.label}
                          </Link>
                        )}
                      </>
                    )}
                    {t.topic && /sample/i.test(t.topic.name) && <SampleBadge />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {tasks.length > 0 && (
        <div className="mt-3 text-[13px] text-steel">
          {remainingMin === 0 ? "All done for today." : `${remainingMin} min remaining today.`}
        </div>
      )}
    </div>
  );
}
