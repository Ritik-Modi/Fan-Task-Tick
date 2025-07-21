import { useAppSelector } from "@/store/hook";
import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const accountType = user?.accountType;

  if (!user) {
    return <div className="text-center mt-10 text-white">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-start pt-8">
      {accountType === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default Dashboard;
