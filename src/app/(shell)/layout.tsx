import { AlertsCenter } from "@/components/AlertsCenter";
import BottomNav from "@/components/BottomNav";
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
        <header className="fixed top-0 left-0 right-0 h-16 bg-transparent backdrop-blur-xl flex items-center justify-between px-4 z-50 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Tredia</h1>
          <AlertsCenter />
        </header>
        <main className="pt-20 pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
