import { QuestionList } from "@/components/QuestionList";
import { MOCK_PRACTICE } from "@/lib/mock";
import { SectionTitle } from "@/components/ui";

export default function PracticePage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-neutral-100">Practice</h1>
      <p className="text-sm text-neutral-500 mt-1">Book/exercise references only — no copyrighted text. Full stems only where permitted.</p>
      <SectionTitle>Questions</SectionTitle>
      <QuestionList questions={MOCK_PRACTICE} />
    </div>
  );
}
