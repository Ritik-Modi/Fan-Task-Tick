import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/eventSlice";
import { fetchAllGenres } from "@/store/genreSlice";
import { Calendar, Music, DollarSign, TrendingUp, Activity } from "lucide-react";
import EventManager from "./EventManager";
import GenreManager from "./GenreManager";

const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Events", value: "events" },
  { label: "Genres", value: "genres" },
];

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState("dashboard");
  
  const { events } = useAppSelector((state) => state.admin);
  const { genres } = useAppSelector((state) => state.genre);

  useEffect(() => {
    dispatch(fetchAllEvents());
    dispatch(fetchAllGenres());
  }, [dispatch]);

  // Calculate statistics
  const totalEvents = events.length;
  const totalGenres = genres.length;
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
  const totalTickets = events.length * 2; // Placeholder calculation

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: string;
  }) => (
    <div className="dashboard-card bg-gray-800/50 glass rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-mint/10 to-blue-500/10 rounded-xl p-6 border border-mint/20">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-300">Manage your events, genres, and track your platform's performance.</p>
      </div>

      {/* Statistics Grid */}
      <div className="dashboard-grid">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={Calendar}
          color="bg-gray-700"
          trend="+12% this month"
        />
        <StatCard
          title="Active Genres"
          value={totalGenres}
          icon={Music}
          color="bg-gray-700"
          trend="+3 new genres"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={Activity}
          color="bg-gray-700"
          trend="+5 this week"
        />
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          icon={DollarSign}
          color="bg-gray-700"
          trend="+25% sales"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card bg-gray-800/50 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-300" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setTab("events")}
              className="w-full text-left p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600 transition-all duration-200"
            >
              <div className="font-medium">Create New Event</div>
              <div className="text-sm text-gray-400">Add a new event with tickets</div>
            </button>
            <button
              onClick={() => setTab("genres")}
              className="w-full text-left p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600 transition-all duration-200"
            >
              <div className="font-medium">Add New Genre</div>
              <div className="text-sm text-gray-400">Create a new event genre</div>
            </button>
          </div>
        </div>

        <div className="dashboard-card bg-gray-800/50 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-300" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event._id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{event.title}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-gray-400 text-sm">No recent events</div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="dashboard-card bg-gray-800/50 glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
        <div className="h-48 bg-gray-700/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Performance charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-gray-900  overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-100">Admin Dashboard</h1>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/30 border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {TABS.map((t) => (
              <button
                key={t.value}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  tab === t.value
                    ? "border-gray-200 text-gray-200"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/30 rounded-xl p-6 h-[calc(100vh-200px)] overflow-y-auto">
          {tab === "dashboard" && <DashboardOverview />}
          {tab === "events" && <EventManager />}
          {tab === "genres" && <GenreManager />}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setTab("events")}
        className="fab bg-gray-700 hover:bg-gray-600 text-gray-200"
        title="Create New Event"
      >
        <Calendar className="w-6 h-6" />
      </button>
    </div>
  );
}

export default AdminDashboard;