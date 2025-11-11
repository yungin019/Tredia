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
    <footer className="fixed bottom-0 left-0 right-0 h-20 glass flex items-center justify-center z-50 border-t border-white/10">
      <div className="flex w-full max-w-md justify-around">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center w-16 text-xs text-white/60 hover:text-brand-cyan transition-colors relative pt-1 group",
              {
                "text-brand-cyan": pathname === item.href,
              }
            )}
          >
            <div className="relative">
              <item.icon size={22} className="mb-1" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-cyan opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
            </div>
            <span className="tracking-wide font-semibold">{item.label}</span>
            {pathname === item.href && (
              <motion.div
                className="absolute top-0 h-1 w-12 bg-brand-cyan rounded-full shadow-neonSm"
                layoutId="underline"
              />
            )}
          </a>
        ))}
      </div>
    </footer>
  );
}
