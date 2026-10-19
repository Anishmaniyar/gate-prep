import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

// Typography: Instrument Serif (display/name) + Google Sans Flex (body).
// Loaded via a Google Fonts stylesheet because Google Sans Flex is newer than
// Next 14's bundled next/font/google manifest. Families resolve through the
// --font-display / --font-body custom properties declared in globals.css.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Instrument+Serif:ital@0;1&display=swap";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body className="bg-canvas text-graphite font-body antialiased">
        <Navbar />
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6">
          <main className="page-enter py-10 md:py-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
