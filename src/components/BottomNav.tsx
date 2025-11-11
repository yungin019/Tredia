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
    <footer className="fixed bottom-0 left-0 right-0 h-20 glass flex items-center justify-around z-50 border-t border-white/10">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center w-16 text-xs text-white/60 hover:text-brand-cyan transition-colors relative pt-1",
            pathname === item.href && "text-brand-cyan"
          )}
        >
          <item.icon size={22} className="mb-1" />
          <span className="tracking-wide">{item.label}</span>
          {pathname === item.href && (
            <motion.div
              className="absolute top-0 h-1 w-12 bg-brand-cyan rounded-full shadow-neonSm"
              layoutId="underline"
            />
          )}
        </a>
      ))}
    </footer>
  );
}
