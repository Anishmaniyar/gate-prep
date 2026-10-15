import Link from "next/link";
import { QuestionList } from "@/components/QuestionList";
import { TopicTree } from "@/components/TopicTree";
import { ProgressBar, SampleBadge, SectionTitle, Card } from "@/components/ui";
import { MOCK_TOPICS, MOCK_PYQS, MOCK_PRACTICE } from "@/lib/mock";

export default function ChapterDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Link href="/subjects" className="text-xs text-neutral-500">← Subjects</Link>
      <h1 className="text-lg font-medium text-neutral-100 mt-2">Chapter: {params.id}<SampleBadge /></h1>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex-1"><ProgressBar value={50} /></div>
        <span className="text-sm text-neutral-400">50%</span>
      </div>

      <SectionTitle>Topics & subtopics</SectionTitle>
      <TopicTree topics={MOCK_TOPICS} />

      <SectionTitle>Resources</SectionTitle>
      <Card>
        <div className="text-sm text-neutral-200">SAMPLE Logic lecture (placeholder)<SampleBadge /></div>
        <div className="text-xs text-neutral-500 mt-1">VIDEO · https://example.com/sample-logic</div>
      </Card>

      <SectionTitle>Related PYQs</SectionTitle>
      <QuestionList questions={MOCK_PYQS} />

      <SectionTitle>Related practice</SectionTitle>
      <QuestionList questions={MOCK_PRACTICE} />
    </div>
  );
}
