import type { Metadata } from "next";
import { SubjectsSyllabus } from "@/components/SubjectsSyllabus";

export const metadata: Metadata = {
  title: "Subjects & Syllabus · Axiom",
};

export default function SubjectsPage() {
  return <SubjectsSyllabus />;
}
