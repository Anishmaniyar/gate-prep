"use client";
import { useState } from "react";

export type TopicNode = {
  id: string;
  name: string;
  slug: string;
  priority?: string;
  completed?: boolean;
  children?: TopicNode[];
};

export function TopicTree({ topics, onToggle }: { topics: TopicNode[]; onToggle?: (id: string, done: boolean) => void }) {
  return (
    <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
      {topics.map((t) => (
        <TopicRow key={t.id} topic={t} onToggle={onToggle} />
      ))}
    </ul>
  );
}

function TopicRow({ topic, onToggle }: { topic: TopicNode; onToggle?: (id: string, done: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const hasChildren = (topic.children?.length ?? 0) > 0;
  return (
    <li className="px-3 py-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!topic.completed}
          onChange={(e) => onToggle?.(topic.id, e.target.checked)}
          aria-label={`Mark ${topic.name} complete`}
          className="accent-neutral-300"
        />
        <button onClick={() => setOpen((v) => !v)} className="flex-1 text-left text-sm text-neutral-200">
          {topic.name}
          <span className="text-neutral-500 text-xs ml-2">{topic.priority ?? ""}</span>
        </button>
        {hasChildren && <span className="text-xs text-neutral-500">{open ? "−" : "+"}</span>}
      </div>
      {open && hasChildren && (
        <ul className="mt-2 ml-6 space-y-1 border-l border-neutral-800 pl-3">
          {topic.children!.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={!!c.completed}
                onChange={(e) => onToggle?.(c.id, e.target.checked)}
                aria-label={`Mark ${c.name} complete`}
                className="accent-neutral-300"
              />
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
