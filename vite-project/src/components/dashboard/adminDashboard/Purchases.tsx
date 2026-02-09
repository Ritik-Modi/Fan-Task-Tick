import { useEffect, useState } from "react";
import axios from "axios";
import { adminEndpoints } from "@/services/api";

type Purchase = {
  _id: string;
  userId?: { fullName?: string; email?: string };
  verifiedIdentityId?: { name?: string; email?: string; phone?: string };
  ticketId?: { title?: string; eventId?: { title?: string } };
  quantity: number;
  totalPrice: number;
  createdAt?: string;
};

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(adminEndpoints.getPurchases);
        setPurchases(res.data.purchases || []);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch purchases");
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold text-white mb-6">All Purchases</h1>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#121212] text-gray-400">
            <tr>
              <th className="p-3">Buyer</th>
              <th className="p-3">Identity</th>
              <th className="p-3">Event</th>
              <th className="p-3">Ticket</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id} className="border-t border-gray-800">
                <td className="p-3 text-gray-300">
                  <div className="text-white">{p.userId?.fullName}</div>
                  <div className="text-gray-400">{p.userId?.email}</div>
                </td>
                <td className="p-3 text-gray-300">
                  <div>{p.verifiedIdentityId?.name}</div>
                  <div className="text-gray-400">{p.verifiedIdentityId?.email}</div>
                  <div className="text-gray-500">{p.verifiedIdentityId?.phone}</div>
                </td>
                <td className="p-3">{p.ticketId?.eventId?.title || "—"}</td>
                <td className="p-3">{p.ticketId?.title || "—"}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">₹{p.totalPrice}</td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td className="p-4 text-gray-400" colSpan={6}>No purchases yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
