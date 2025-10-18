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
  return (
    <div
      className={cn(
        // ✅ Full height on desktop, fixed bottom on mobile
        "md:relative md:w-64 md:h-screen bg-[#0e0e0e] border-t md:border-t-0 md:border-r border-gray-800 z-50 flex md:flex-col"
      )}
    >
      {/* === Desktop Sidebar === */}
      <div className="hidden md:flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-center px-5 py-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        {/* Menu */}
        <nav className="mt-6 flex flex-col gap-1 px-2 flex-1">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect(item.value)}
              className={cn(
                "flex items-center gap-3 py-3 px-4 rounded-md hover:bg-[#1a1a1a] text-left transition-all text-gray-300",
                activeTab === item.value && "bg-[#1f1f1f] text-white"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* === Mobile Bottom Nav === */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 flex md:hidden justify-around items-center py-2 bg-[#0e0e0e] border-t border-gray-800",
          "z-[9999] m-0 p-0"
        )}
        style={{
          // ✅ removes default safe area inset padding on iOS devices
          paddingBottom: "env(safe-area-inset-bottom)",
          marginBottom: 0,
        }}
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onSelect(item.value)}
            className={cn(
              "flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all py-2 flex-1",
              activeTab === item.value && "text-purple-400"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
