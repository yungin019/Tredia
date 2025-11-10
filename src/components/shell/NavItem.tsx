
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center text-xs transition-colors duration-300",
        isActive ? "text-primary" : "text-gray-400 hover:text-white"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          isActive && "bg-primary/10 shadow-[0_0_15px_rgba(0,191,255,0.5)]"
        )}
      >
        {icon}
      </div>
      {label}
    </Link>
  );
};
