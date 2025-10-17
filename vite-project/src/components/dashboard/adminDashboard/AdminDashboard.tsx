import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import ManageEvents from "./ManageEvent";
import { LayoutDashboard, CalendarDays } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, value: "dashboard" },
    { name: "Manage Events", icon: <CalendarDays />, value: "events" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "events":
        return <ManageEvents />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar items={sidebarItems} activeTab={activeTab} onSelect={setActiveTab} />
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
