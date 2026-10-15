import Link from "next/link";
import type { DashboardSubject } from "@/lib/dashboard";
import { Card, SampleBadge } from "@/components/ui";

/** Compact horizontal bars — syllabus completion only, never question counts. */
export function SubjectBars({ subjects }: { subjects: DashboardSubject[] }) {
  const ordered = [...subjects];
  return (
    <Card>
      <div className="text-sm font-medium text-neutral-100">Subjects</div>
      <div className="text-xs text-neutral-500 mt-0.5">Syllabus completion by subject</div>
      {ordered.length === 0 ? (
        <p className="text-sm text-neutral-500 mt-3">No subjects yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {ordered.map((s) => (
            <li key={s.id}>
              <Link href={`/subjects/${s.slug}`} className="block group">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-neutral-200 truncate group-hover:underline">
                    {s.name}
                    {s.isSample && <SampleBadge />}
                  </span>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                    {s.progress}% · {s.topicCompleted}/{s.topicTotal}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-neutral-800 rounded" role="progressbar" aria-valuenow={s.progress} aria-label={`${s.name} progress`}>
                  <div className="h-1.5 bg-neutral-300 rounded" style={{ width: `${s.progress}%` }} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
