"use client";

export type Task = {
  id: string;
  title: string;
  taskType: string;
  estimatedMinutes: number;
  status: string;
  topicName?: string;
};

export function TaskList({ tasks, onToggle }: { tasks: Task[]; onToggle?: (id: string, done: boolean) => void }) {
  if (tasks.length === 0) return <p className="text-sm text-neutral-500">No tasks.</p>;
  return (
    <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center gap-3 px-3 py-2">
          <input
            type="checkbox"
            checked={t.status === "COMPLETED"}
            onChange={(e) => onToggle?.(t.id, e.target.checked)}
            aria-label={`Mark task ${t.title} complete`}
            className="accent-neutral-300"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-neutral-200 truncate">{t.title}</div>
            <div className="text-xs text-neutral-500">
              {t.taskType} · {t.estimatedMinutes} min {t.topicName ? `· ${t.topicName}` : ""}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
