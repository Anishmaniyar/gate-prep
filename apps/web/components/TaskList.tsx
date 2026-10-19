"use client";

export type Task = {
  id: string;
  title: string;
  taskType: string;
  estimatedMinutes: number;
  status: string;
  topicName?: string;
  scheduledDate?: string;
};

export function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle?: (id: string, done: boolean) => void }) {
  if (tasks.length === 0) return <p className="text-[15px] text-steel">No tasks.</p>;
  return (
    <ul className="divide-y divide-mist rounded-cards border border-mist bg-canvas">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center gap-3 px-5 py-4">
          <input
            type="checkbox"
            checked={t.status === "COMPLETED"}
            onChange={(e) => onToggle?.(t.id, e.target.checked)}
            aria-label={`Mark task ${t.title} complete`}
            className="accent-[var(--graphite)]"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] text-graphite">{t.title}</div>
            <div className="text-[13px] text-steel">
              {t.taskType} · {t.estimatedMinutes} min {t.topicName ? `· ${t.topicName}` : ""}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
