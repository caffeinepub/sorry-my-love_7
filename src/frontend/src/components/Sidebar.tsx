import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookOpen,
  Home,
  Library,
  Mic,
  Settings,
} from "lucide-react";
import type { Page } from "../App";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { id: "practice", label: "Practice", icon: <Mic className="w-4 h-4" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="w-4 h-4" />,
  },
  { id: "library", label: "Library", icon: <Library className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 bg-sidebar flex flex-col py-6 px-3">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sidebar-foreground font-bold text-lg tracking-tight">
          PrepAI
        </span>
      </div>
      <nav className="flex flex-col gap-1" data-ocid="sidebar.panel">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`sidebar.${item.id}.link`}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left",
              currentPage === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-3">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <p className="text-sidebar-foreground text-xs font-semibold mb-1">
            Pro Tip
          </p>
          <p className="text-sidebar-foreground/70 text-xs leading-relaxed">
            Practice daily for 30 minutes to see a 40% score improvement.
          </p>
        </div>
      </div>
    </aside>
  );
}
