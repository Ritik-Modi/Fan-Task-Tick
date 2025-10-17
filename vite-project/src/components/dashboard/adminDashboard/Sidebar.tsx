import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  value: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  onSelect: (value: string) => void;
}

export default function Sidebar({ items, activeTab, onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-[#0e0e0e] border-r border-gray-800 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect(item.value)}
              className={cn(
                "flex items-center gap-3 py-3 px-5 hover:bg-[#1a1a1a] w-full text-left transition-all",
                activeTab === item.value && "bg-[#1f1f1f]"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
