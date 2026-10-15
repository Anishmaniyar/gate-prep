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
      <h1 className="text-lg font-medium text-neutral-100">Subjects</h1>
      <p className="text-sm text-neutral-500 mt-1">Official GATE 2027 CS syllabus lands in Phase 4. Current rows are samples.</p>
      <ul className="mt-4 border border-neutral-800 rounded divide-y divide-neutral-800">
        {subjects.map((s) => (
          <li key={s.slug} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/subjects/${s.slug}`} className="text-sm text-neutral-100">
                {s.name}
                <SampleBadge />
              </Link>
              <span className="text-xs text-neutral-500">{s.topicCompleted}/{s.topicTotal} · {s.progress}%</span>
            </div>
            <div className="mt-2"><ProgressBar value={s.progress} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
