
import {
  Home,
  LineChart,
  Target,
  FileText,
  MessageSquare,
} from "lucide-react";
import { NavItem } from "./NavItem";

export const NavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm flex items-center justify-around z-50">
      <NavItem href="/feed" icon={<Home size={24} />} label="Feed" />
      <NavItem href="/trends" icon={<LineChart size={24} />} label="Trends" />
      <NavItem
        href="/predictions"
        icon={<Target size={24} />}
        label="Predictions"
      />
      <NavItem
        href="/signals"
        icon={<FileText size={24} />}
        label="Signals"
      />
      <NavItem
        href="/assistant"
        icon={<MessageSquare size={24} />}
        label="Assistant"
      />
    </nav>
  );
};
