import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-lato" });

export const metadata: Metadata = {
  title: "Skipline (Demo)",
  description: "Class-project demo of how bar line-skip and cover pass apps work.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c2244",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="font-sans antialiased">
        <div className="app-bg fixed inset-0 -z-10" />
        <div className="mx-auto min-h-dvh max-w-md">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
