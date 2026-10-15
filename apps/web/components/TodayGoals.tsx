"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { formatDay, TASK_TYPE_LABEL, type DashboardTask } from "@/lib/dashboard";
import { Card, SampleBadge } from "@/components/ui";

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
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-neutral-100">Today&apos;s Goals</div>
          <div className="text-xs text-neutral-500 mt-0.5">{formatDay(date)}</div>
        </div>
        <div className="text-xs text-neutral-400 whitespace-nowrap">
          {done}/{tasks.length} done
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="mt-3 h-1.5 w-full bg-neutral-800 rounded" role="progressbar" aria-valuenow={tasks.length ? Math.round((done / tasks.length) * 100) : 0}>
          <div
            className="h-1.5 bg-neutral-300 rounded"
            style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-neutral-500 mt-3">
          No tasks assigned for today. Add some in <Link href="/planly" className="underline">Planly</Link>.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-800">
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
                  className="accent-neutral-300 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${t.status === "COMPLETED" ? "text-neutral-500 line-through" : "text-neutral-200"}`}>
                    {t.title}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {TASK_TYPE_LABEL[t.taskType]} · {t.estimatedMinutes} min
                    {link && (
                      <>
                        {" · "}
                        {link.href.startsWith("http") ? (
                          <a href={link.href} target="_blank" rel="noreferrer" className="underline">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className="underline">
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
        <div className="text-xs text-neutral-500 mt-3">
          {remainingMin === 0 ? "All done for today." : `${remainingMin} min remaining today.`}
        </div>
      )}
    </Card>
  );
}
