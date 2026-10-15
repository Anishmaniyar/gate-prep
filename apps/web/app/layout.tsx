import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Axiom — GATE 2027 CS Planner",
  description: "Axiom: single-user GATE 2027 CS preparation workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-200">
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 max-w-5xl mx-auto w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
