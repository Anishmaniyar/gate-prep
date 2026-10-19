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
    <ul className="divide-y divide-mist rounded-cards border border-mist bg-canvas">
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
    <li className="px-5 py-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!topic.completed}
          onChange={(e) => onToggle?.(topic.id, e.target.checked)}
          aria-label={`Mark ${topic.name} complete`}
          className="accent-[var(--graphite)]"
        />
        <button onClick={() => setOpen((v) => !v)} className="flex-1 text-left text-[15px] text-graphite">
          {topic.name}
          {topic.priority && <span className="ml-2 text-[13px] text-steel">{topic.priority}</span>}
        </button>
        {hasChildren && <span className="text-[13px] text-slate">{open ? "−" : "+"}</span>}
      </div>
      {open && hasChildren && (
        <ul className="mb-1 ml-6 mt-2 space-y-1 border-l border-mist pl-3">
          {topic.children!.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-[15px] text-graphite">
              <input
                type="checkbox"
                checked={!!c.completed}
                onChange={(e) => onToggle?.(c.id, e.target.checked)}
                aria-label={`Mark ${c.name} complete`}
                className="accent-[var(--graphite)]"
              />
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
