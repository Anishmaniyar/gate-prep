import Link from "next/link";
import { ProgressBar, SampleBadge, SectionTitle } from "@/components/ui";
import { TopicTree } from "@/components/TopicTree";
import { MOCK_TOPICS } from "@/lib/mock";

export default function SubjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <Link href="/subjects" className="text-xs text-neutral-500">← Subjects</Link>
      <h1 className="text-lg font-medium text-neutral-100 mt-2">Subject: {params.slug}<SampleBadge /></h1>
      <p className="text-sm text-neutral-500 mt-1">Completion is computed from topic checkboxes (mocked until API wired in Phase 3).</p>

      <SectionTitle>Progress</SectionTitle>
      <div className="flex items-center gap-3">
        <div className="flex-1"><ProgressBar value={25} /></div>
        <span className="text-sm text-neutral-400">25%</span>
      </div>

      <SectionTitle>Chapters</SectionTitle>
      <ul className="border border-neutral-800 rounded divide-y divide-neutral-800">
        <li className="px-3 py-2 flex justify-between text-sm">
          <Link href="/chapters/sample-logic" className="text-neutral-200">SAMPLE Logic<SampleBadge /></Link>
          <span className="text-neutral-500">50%</span>
        </li>
      </ul>

      <SectionTitle>Important topics</SectionTitle>
      <TopicTree topics={MOCK_TOPICS} />
    </div>
  );
}
