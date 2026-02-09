import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import ManageEvents from "./ManageEvent";
import Purchases from "./Purchases";
import SuspiciousUsers from "./SuspiciousUsers";
import { LayoutDashboard, CalendarDays, ShoppingBag, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, value: "dashboard" },
    { name: "Manage Events", icon: <CalendarDays />, value: "events" },
    { name: "Purchases", icon: <ShoppingBag />, value: "purchases" },
    { name: "Risk", icon: <AlertTriangle />, value: "risk" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "events":
        return <ManageEvents />;
      case "purchases":
        return <Purchases />;
      case "risk":
        return <SuspiciousUsers />;
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
