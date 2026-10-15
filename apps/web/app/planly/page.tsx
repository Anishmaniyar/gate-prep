"use client";
import { useState } from "react";
import { TaskList, type Task } from "@/components/TaskList";
import { MOCK_TASKS } from "@/lib/mock";
import { SectionTitle } from "@/components/ui";

const DAYS = ["2026-10-15", "2026-10-16", "2026-10-17"];

export default function PlanlyPage() {
  const [day, setDay] = useState(DAYS[0]);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div>
      <h1 className="text-lg font-medium text-neutral-100">Planly — Daily Study Planner</h1>
      <p className="text-sm text-neutral-500 mt-1">SAMPLE schedule. Real day-wise planner persists via API in Phase 3.</p>
      <SectionTitle>Days</SectionTitle>
      <div className="flex gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`px-3 py-1.5 text-sm rounded border ${day === d ? "border-neutral-500 text-neutral-100" : "border-neutral-800 text-neutral-400"}`}
          >
            {d}
          </button>
        ))}
      </div>
      <SectionTitle>Tasks for {day}</SectionTitle>
      <TaskList
        tasks={tasks}
        onToggle={(id, done) =>
          setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: done ? "COMPLETED" : "PENDING" } : t)))
        }
      />
    </div>
  );
}
