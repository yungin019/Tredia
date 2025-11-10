"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bot,
  Flame,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/feed", label: "Feed", icon: <LayoutGrid size={20} /> },
  { href: "/trends", label: "Trends", icon: <BarChart size={20} /> },
  { href: "/predictions", label: "Predictions", icon: <Flame size={20} /> },
  { href: "/signals", label: "Signals", icon: <BarChart size={20} /> },
  { href: "/assistant", label: "Assistant", icon: <Bot size={20} /> },
];

export const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full">
      <div className="hidden md:flex items-center gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
