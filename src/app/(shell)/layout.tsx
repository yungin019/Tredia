
import { AlertsCenter } from "@/components/AlertsCenter";
import { NavBar } from "@/components/shell/NavBar";
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
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 z-50">
          <h1 className="text-2xl font-bold">Tredia</h1>
          <AlertsCenter />
        </header>
        <main className="pt-16 pb-16">{children}</main>
        <NavBar />
      </body>
    </html>
  );
}
