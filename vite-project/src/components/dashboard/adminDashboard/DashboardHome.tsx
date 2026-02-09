import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Ticket, TrendingUp, BarChart2 } from "lucide-react";
import { eventEndpoints } from "@/services/api";

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between bg-[#151515] border border-gray-800 rounded-xl p-6 hover:bg-[#1e1e1e] transition-all">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
      <div className="p-3 bg-[#222] rounded-lg text-mint text-2xl">{icon}</div>
    </div>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    totalTickets: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(eventEndpoints.getAllEvents);
      const events = Array.isArray(data) ? data : data.events || [];

      const now = new Date();
      const active = events.filter(
        (e: any) => new Date(e.startDate) <= now && new Date(e.endDate) >= now
      );
      const upcoming = events.filter((e: any) => new Date(e.startDate) > now);

      setStats({
        totalEvents: events.length,
        activeEvents: active.length,
        upcomingEvents: upcoming.length,
        totalTickets: 0,
        totalIncome: 0,
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<CalendarDays />} title="Total Events" value={stats.totalEvents} />
        <StatCard icon={<Ticket />} title="Total Tickets Sold" value={stats.totalTickets} />
        <StatCard icon={<TrendingUp />} title="Total Income" value={`₹${stats.totalIncome}`} />
        <StatCard icon={<BarChart2 />} title="Active Events" value={stats.activeEvents} />
        <StatCard icon={<CalendarDays />} title="Upcoming Events" value={stats.upcomingEvents} />
      </div>
    </div>
  );
}
