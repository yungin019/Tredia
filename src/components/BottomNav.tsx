"use client";

import { Home, LineChart, PieChart, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/trends", icon: LineChart, label: "Trends" },
    { href: "/portfolio", icon: PieChart, label: "Portfolio" },
    { href: "/assistant", icon: MessageSquare, label: "Assistant" },
  ];

  return (
    <footer className="fixed bottom-4 left-4 right-4 h-16 glass flex items-center justify-around z-50 rounded-full">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center text-xs text-white/70 hover:text-brand-cyan transition-colors relative",
            pathname === item.href && "text-brand-cyan"
          )}
        >
          <item.icon size={24} className="mb-1" />
          <span>{item.label}</span>
          {pathname === item.href && (
            <motion.div
              className="absolute -bottom-1 h-0.5 w-6 bg-brand-cyan rounded-full"
              layoutId="underline"
            />
          )}
        </a>
      ))}
    </footer>
  );
}
