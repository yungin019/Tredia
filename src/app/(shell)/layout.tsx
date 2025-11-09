import { AlertsCenter } from "@/components/AlertsCenter";
import { Home, LineChart, PieChart, MessageSquare } from "lucide-react";
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
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 z-50">
          <h1 className="text-2xl font-bold">Tredia</h1>
          <AlertsCenter />
        </header>
        <main className="pt-16 pb-16">{children}</main>
        <footer className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm flex items-center justify-around z-50">
          <a href="/feed" className="flex flex-col items-center text-xs">
            <Home size={24} />
            Feed
          </a>
          <a href="/trends" className="flex flex-col items-center text-xs">
            <LineChart size={24} />
            Trends
          </a>
          <a href="/portfolio" className="flex flex-col items-center text-xs">
            <PieChart size={24} />
            Portfolio
          </a>
          <a href="/assistant" className="flex flex-col items-center text-xs">
            <MessageSquare size={24} />
            Assistant
          </a>
        </footer>
      </body>
    </html>
  );
}
