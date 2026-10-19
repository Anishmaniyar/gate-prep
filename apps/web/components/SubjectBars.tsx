import Link from "next/link";
import type { DashboardSubject } from "@/lib/dashboard";
import { SampleBadge } from "@/components/ui";

/** Compact horizontal bars — syllabus completion only, never question counts. */
export function SubjectBars({ subjects }: { subjects: DashboardSubject[] }) {
  if (subjects.length === 0) {
    return <p className="text-[13px] text-steel">No subjects yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((s) => (
        <li key={s.id}>
          <Link href={`/subjects/${s.slug}`} className="group block">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[15px] text-graphite group-hover:underline">
                {s.name}
                {s.isSample && <SampleBadge />}
              </span>
              <span className="whitespace-nowrap text-[13px] text-steel tabular-nums">
                {s.progress}% · {s.topicCompleted}/{s.topicTotal}
              </span>
            </div>
            <div
              className="mt-1.5 h-1.5 w-full rounded-full bg-fog"
              role="progressbar"
              aria-valuenow={s.progress}
              aria-label={`${s.name} progress`}
            >
              <div
                className="h-1.5 rounded-full bg-graphite transition-all duration-200 ease-out"
                style={{ width: `${s.progress}%` }}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
