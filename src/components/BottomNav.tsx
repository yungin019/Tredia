"use client";

import { Home, LineChart, PieChart, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
      <div className="flex w-full max-w-md justify-evenly items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center h-full w-24 text-xs text-white/[0.85] hover:text-brand-cyan transition-all duration-300 relative pt-1 group gap-1",
              {
                "text-brand-cyan [text-shadow:0_0_10px_theme(colors.brand.cyan)]":
                  pathname === item.href,
              }
            )}
          >
            <item.icon size={22} />
            <span className="tracking-wide font-medium">{item.label}</span>
            {pathname === item.href && (
              <motion.div
                className="absolute bottom-2 h-[2px] w-8 bg-brand-cyan rounded-full"
                style={{ boxShadow: "0 0 12px 0px #00B8FF" }}
                layoutId="underline"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </footer>
  );
}
