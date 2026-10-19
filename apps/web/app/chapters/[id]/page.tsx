import Link from "next/link";
import { TopicTree } from "@/components/TopicTree";
import { ProgressBar, SampleBadge, SectionCard } from "@/components/ui";
import { MOCK_TOPICS } from "@/lib/mock";

export default function ChapterDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Link href="/subjects" className="text-[13px] text-steel transition-colors hover:text-ember">← Subjects</Link>
      <h1 className="editorial-heading mt-2 text-heading tracking-[-0.02em] text-graphite">
        {params.id}<SampleBadge />
      </h1>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1"><ProgressBar value={50} /></div>
        <span className="font-display text-subheading font-light tracking-[-0.02em] text-graphite">50%</span>
      </div>

      <div className="mt-8 space-y-6">
        <SectionCard title="Topics & subtopics">
          <TopicTree topics={MOCK_TOPICS} />
        </SectionCard>

        <SectionCard title="Resources">
          <div className="text-[15px] text-graphite">SAMPLE Logic lecture (placeholder)<SampleBadge /></div>
          <div className="mt-1 text-[13px] text-steel">VIDEO · https://example.com/sample-logic</div>
        </SectionCard>
      </div>
    </div>
  );
}
