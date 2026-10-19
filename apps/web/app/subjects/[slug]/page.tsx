import Link from "next/link";
import { ProgressBar, SampleBadge, SectionCard, Chip } from "@/components/ui";
import { TopicTree } from "@/components/TopicTree";
import { MOCK_TOPICS } from "@/lib/mock";

export default function SubjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <Link href="/subjects" className="text-[13px] text-steel transition-colors hover:text-ember">← Subjects</Link>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
        {params.slug}<SampleBadge />
      </h1>
      <p className="mt-2 text-[13px] text-steel">Completion is computed from topic checkboxes (mocked until API wired in Phase 3).</p>
      <div className="mt-4 flex gap-2">
        <Chip label="Weight" count="High" />
        <Chip label="Progress" count="25%" />
      </div>

      <div className="mt-8 space-y-6">
        <SectionCard title="Progress">
          <div className="flex items-center gap-3">
            <div className="flex-1"><ProgressBar value={25} /></div>
            <span className="font-display text-subheading font-light tracking-[-0.02em] text-graphite">25%</span>
          </div>
        </SectionCard>

        <SectionCard title="Chapters">
          <ul className="divide-y divide-mist">
            <li className="flex items-center justify-between py-3">
              <Link href="/chapters/sample-logic" className="text-[15px] text-graphite hover:underline">SAMPLE Logic<SampleBadge /></Link>
              <span className="text-[13px] text-steel">50%</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Important topics">
          <TopicTree topics={MOCK_TOPICS} />
        </SectionCard>
      </div>
    </div>
  );
}
