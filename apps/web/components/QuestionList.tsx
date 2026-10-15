export type QuestionItem = {
  id: string;
  sourceType: string;
  questionType: string;
  content?: string | null;
  year?: number | null;
  marks?: number | null;
  sourceRef?: string | null;
  verified: boolean;
  topicName?: string;
};

export function QuestionList({ questions }: { questions: QuestionItem[] }) {
  if (questions.length === 0) return <p className="text-sm text-neutral-500">No questions.</p>;
  return (
    <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
      {questions.map((q) => (
        <li key={q.id} className="px-3 py-2">
          <div className="text-sm text-neutral-200">{q.content ?? q.sourceRef ?? q.id}</div>
          <div className="text-xs text-neutral-500 mt-1">
            {q.sourceType} · {q.questionType}
            {q.year ? ` · ${q.year}` : ""} {q.marks ? ` · ${q.marks}m` : ""}
            {q.topicName ? ` · ${q.topicName}` : ""} · {q.verified ? "verified" : "unverified"}
          </div>
        </li>
      ))}
    </ul>
  );
}
