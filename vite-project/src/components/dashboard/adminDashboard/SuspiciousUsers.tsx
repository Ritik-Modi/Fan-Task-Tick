import { useEffect, useState } from "react";
import axios from "axios";
import { adminEndpoints } from "@/services/api";
import { Button } from "@/components/ui/button";

type SuspiciousUser = {
  id: string;
  fullName: string;
  email: string;
  status: "active" | "suspended";
  flagged: boolean;
  riskScore: number;
  reasons: string[];
  recommendation?: string;
  summary?: string;
};

export default function SuspiciousUsers() {
  const [users, setUsers] = useState<SuspiciousUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(adminEndpoints.getSuspiciousUsers);
      setUsers(res.data.users || []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load suspicious users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFlag = async (id: string) => {
    await axios.post(adminEndpoints.flagUser(id), { reason: "Flagged by admin" });
    fetchUsers();
  };

  const handleSuspend = async (id: string) => {
    await axios.put(adminEndpoints.deactivateUser(id));
    fetchUsers();
  };

  const handleActivate = async (id: string) => {
    await axios.put(adminEndpoints.activateUser(id));
    fetchUsers();
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Suspicious Users</h1>
        <Button onClick={fetchUsers} variant="outline">Refresh</Button>
      </div>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#121212] text-gray-400">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Reasons</th>
              <th className="p-3">Recommendation</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-800">
                <td className="p-3">
                  <div className="text-white">{u.fullName}</div>
                  <div className="text-gray-400">{u.email}</div>
                </td>
                <td className="p-3">
                  <span className={u.riskScore >= 50 ? "text-red-400" : "text-yellow-400"}>
                    {u.riskScore}
                  </span>
                </td>
                <td className="p-3 text-gray-300">
                  {u.reasons.length ? u.reasons.join(" · ") : "—"}
                </td>
                <td className="p-3 text-gray-300">
                  {u.summary || "—"}
                </td>
                <td className="p-3">{u.status}</td>
                <td className="p-3 flex gap-2">
                  <Button onClick={() => handleFlag(u.id)} variant="outline">
                    {u.flagged ? "Flagged" : "Flag"}
                  </Button>
                  {u.status === "active" ? (
                    <Button onClick={() => handleSuspend(u.id)} className="bg-red-600 hover:bg-red-700">
                      Suspend
                    </Button>
                  ) : (
                    <Button onClick={() => handleActivate(u.id)} className="bg-green-600 hover:bg-green-700">
                      Activate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="p-4 text-gray-400" colSpan={5}>No suspicious users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
