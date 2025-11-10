import { AlertsCenter } from "@/components/AlertsCenter";
import { TopNav } from "@/components/layout/TopNav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tredia",
  description: "AI-Powered Market Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black`}>
        <header className="fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-4 sm:px-6 md:px-8 z-50">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-white">Tredia</h1>
            <TopNav />
          </div>
          <AlertsCenter />
        </header>
        <main className="pt-20 pb-4">{children}</main>
      </body>
    </html>
  );
}
