import { QuestionList } from "@/components/QuestionList";
import { MOCK_PYQS } from "@/lib/mock";
import { SectionTitle } from "@/components/ui";

export default function PyqsPage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-neutral-100">PYQs</h1>
      <p className="text-sm text-neutral-500 mt-1">Filter by subject · chapter · topic · year · type (API filters in Phase 3). No fabricated questions.</p>
      <div className="flex gap-2 mt-4 text-xs">
        {["Subject", "Chapter", "Topic", "Year", "Type"].map((f) => (
          <span key={f} className="border border-neutral-800 rounded px-2 py-1 text-neutral-500">{f}: —</span>
        ))}
      </div>
      <SectionTitle>Questions</SectionTitle>
      <QuestionList questions={MOCK_PYQS} />
    </div>
  );
}
