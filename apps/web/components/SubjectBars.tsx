import Link from "next/link";
import type { DashboardSubject } from "@/lib/dashboard";
import { SampleBadge } from "@/components/ui";

/** Compact horizontal bars — syllabus completion only, never question counts. */
export function SubjectBars({ subjects }: { subjects: DashboardSubject[] }) {
  const ordered = [...subjects];
  return (
    <div>
      <div className="text-[15px] font-medium text-graphite">Subjects</div>
      <div className="mt-0.5 text-[13px] text-steel">Syllabus completion by subject</div>
      {ordered.length === 0 ? (
        <p className="mt-3 text-[15px] text-steel">No subjects yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {ordered.map((s) => (
            <li key={s.id}>
              <Link href={`/subjects/${s.slug}`} className="group block">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[15px] text-graphite group-hover:underline">
                    {s.name}
                    {s.isSample && <SampleBadge />}
                  </span>
                  <span className="whitespace-nowrap text-[13px] text-steel">
                    {s.progress}% · {s.topicCompleted}/{s.topicTotal}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-fog" role="progressbar" aria-valuenow={s.progress} aria-label={`${s.name} progress`}>
                  <div className="h-1.5 rounded-full bg-graphite transition-all duration-200 ease-out" style={{ width: `${s.progress}%` }} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
