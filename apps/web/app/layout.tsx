import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

// Display serif (Signifier stand-in; Newsreader kept in CSS fallback stack).
const display = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axiom — GATE 2027 CS Planner",
  description: "Axiom: single-user GATE 2027 CS preparation workspace",
};

function ThemeScript() {
  // class-based dark mode: localStorage first, prefers-color-scheme fallback
  const code = `(function(){try{var t=localStorage.getItem("axiom:theme");if(t==="dark"){document.documentElement.classList.add("dark")}else if(t==="light"){document.documentElement.classList.remove("dark")}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${display.variable} ${body.variable} bg-canvas text-graphite font-body text-[15px] antialiased`}
      >
        <Navbar />
        {/* Mobile horizontal scroll nav lives inside Navbar; desktop shell below */}
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6">
          <div className="flex gap-6 py-10 md:py-12">
            <Sidebar />
            <main className="min-w-0 flex-1 page-enter">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
