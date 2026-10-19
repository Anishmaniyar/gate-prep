import Link from "next/link";
import { ProgressBar, SampleBadge } from "@/components/ui";
import { MOCK_SUBJECTS } from "@/lib/mock";
import { api } from "@/lib/api";

type SubjectsResponse = {
  subjects: { slug: string; name: string; progress: number; topicTotal: number; topicCompleted: number }[];
};

export default async function SubjectsPage() {
  const data = await api.get<SubjectsResponse>("/subjects");
  const subjects = data?.subjects ?? MOCK_SUBJECTS.map((s) => ({ slug: s.slug, name: s.name, progress: s.progress, topicTotal: 4, topicCompleted: 1 }));

  return (
    <div>
      <p className="text-[13px] uppercase tracking-wide text-slate">Syllabus</p>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">Subjects</h1>
      <p className="mt-2 text-[13px] text-steel">Official GATE 2027 CS syllabus lands in Phase 4. Current rows are samples.</p>
      <ul className="mt-8 divide-y divide-mist rounded-cards border border-mist bg-canvas">
        {subjects.map((s) => (
          <li key={s.slug}>
            <Link href={`/subjects/${s.slug}`} className="group block px-5 py-4 transition-colors duration-200 hover:bg-fog">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] text-graphite group-hover:underline">
                  {s.name}
                  <SampleBadge />
                </span>
                <span className="text-[13px] text-steel">{s.topicCompleted}/{s.topicTotal} · {s.progress}%</span>
              </div>
              <div className="mt-2"><ProgressBar value={s.progress} /></div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
