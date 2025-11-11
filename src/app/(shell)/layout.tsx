import { AlertsCenter } from "@/components/AlertsCenter";
import BottomNav from "@/components/BottomNav";
import { Bot } from "lucide-react";
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
    <html lang="en">
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 h-16 bg-transparent backdrop-blur-xl flex items-center justify-between px-6 z-50 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Bot size={28} className="text-brand-cyan" />
            <h1 className="text-xl font-bold text-white tracking-tighter">
              Tredia
            </h1>
          </div>
          <AlertsCenter />
        </header>
        <main className="pt-24 pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
