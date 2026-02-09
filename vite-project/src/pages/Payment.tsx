import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { buyTicket } from "@/store/paymentSlice";
import { identityEndpoints } from "@/services/api";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { Button } from "@/components/ui/button";

type SelectedTicket = {
  ticketId: string;
  quantity: number;
  price: number;
};

type Identity = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  verifiedAt?: string;
  status: "active" | "deactivated";
};

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { checkoutUrl, loading, error } = useAppSelector((s) => s.payment);
  const { user } = useAppSelector((s) => s.auth);

  const { eventId, selected, totalAmount } = (location.state || {}) as {
    eventId?: string;
    selected?: SelectedTicket[];
    totalAmount?: number;
  };

  const [identities, setIdentities] = useState<Identity[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>("");
  const [useSelfIdentity, setUseSelfIdentity] = useState<boolean>(true);
  const [sendForm, setSendForm] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selected || selected.length === 0) {
      navigate("/events");
    } else {
      setSelectedTicketId(selected[0].ticketId);
    }
  }, [selected, navigate]);

  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        const res = await axios.get(identityEndpoints.getMyIdentities);
        setIdentities(res.data.identities || []);
      } catch (e) {
        setMessage(handleAxiosError(e));
      }
    };
    fetchIdentities();
  }, []);

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const selectedTicket = useMemo(() => {
    return selected?.find((t) => t.ticketId === selectedTicketId);
  }, [selected, selectedTicketId]);

  const handleSendOtp = async () => {
    try {
      setMessage(null);
      await axios.post(identityEndpoints.sendOtp, sendForm);
      setPendingEmail(sendForm.email);
      setMessage("OTP sent to email.");
    } catch (e) {
      setMessage(handleAxiosError(e));
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setMessage(null);
      await axios.post(identityEndpoints.verifyOtp, { email: pendingEmail, otp });
      const res = await axios.get(identityEndpoints.getMyIdentities);
      setIdentities(res.data.identities || []);
      setOtp("");
      setPendingEmail("");
      setMessage("Identity verified.");
    } catch (e) {
      setMessage(handleAxiosError(e));
    }
  };

  const handleCheckout = async () => {
    if (!selectedTicket) {
      setMessage("Please select a ticket type.");
      return;
    }
    if (!useSelfIdentity && !selectedIdentityId) {
      setMessage("Please select a verified identity.");
      return;
    }
    const payload: { ticketId: string; quantity: number; verifiedIdentityId?: string } = {
      ticketId: selectedTicket.ticketId,
      quantity: selectedTicket.quantity,
    };
    if (!useSelfIdentity) {
      payload.verifiedIdentityId = selectedIdentityId;
    }
    await dispatch(buyTicket(payload));
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-8 py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Payment</h1>

          <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Select Ticket</h2>
            {selected?.map((t) => (
              <label key={t.ticketId} className="flex items-center gap-3 bg-[#222] p-3 rounded-lg">
                <input
                  type="radio"
                  name="ticket"
                  value={t.ticketId}
                  checked={selectedTicketId === t.ticketId}
                  onChange={() => setSelectedTicketId(t.ticketId)}
                />
                <span className="text-sm">Ticket ID: {t.ticketId}</span>
                <span className="ml-auto text-sm text-gray-300">
                  Qty: {t.quantity} | ₹{t.price}
                </span>
              </label>
            ))}
            <p className="text-xs text-gray-400">
              One checkout per ticket type. If you selected multiple types, pay them separately.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Verified Identities</h2>
            <p className="text-xs text-gray-400">
              Limit: 2 tickets per identity per event. You can buy with your account without verification.
            </p>
            {user && (
              <label className="flex items-center gap-3 bg-[#222] p-3 rounded-lg">
                <input
                  type="radio"
                  name="identity"
                  checked={useSelfIdentity}
                  onChange={() => {
                    setUseSelfIdentity(true);
                    setSelectedIdentityId("");
                  }}
                />
                <div className="text-sm">
                  <div>Use my account</div>
                  <div className="text-gray-400">{user.email}</div>
                  <div className="text-gray-500">{user.fullName}</div>
                </div>
                <span className="ml-auto text-xs text-gray-400">No verification</span>
              </label>
            )}
            {identities.length === 0 ? (
              <p className="text-sm text-gray-400">No verified identities yet.</p>
            ) : (
              <div className="space-y-2">
                {identities.map((i) => (
                  <label key={i._id} className="flex items-center gap-3 bg-[#222] p-3 rounded-lg">
                    <input
                      type="radio"
                      name="identity"
                      value={i._id}
                      checked={!useSelfIdentity && selectedIdentityId === i._id}
                      onChange={() => {
                        setUseSelfIdentity(false);
                        setSelectedIdentityId(i._id);
                      }}
                      disabled={i.status !== "active"}
                    />
                    <div className="text-sm">
                      <div>{i.name}</div>
                      <div className="text-gray-400">{i.email}</div>
                      <div className="text-gray-500">{i.phone}</div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {i.status === "active" ? "Verified" : "Deactivated"}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Add & Verify Identity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                className="bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm"
                placeholder="Full name"
                value={sendForm.name}
                onChange={(e) => setSendForm({ ...sendForm, name: e.target.value })}
              />
              <input
                className="bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm"
                placeholder="Email"
                value={sendForm.email}
                onChange={(e) => setSendForm({ ...sendForm, email: e.target.value })}
              />
              <input
                className="bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm"
                placeholder="Phone"
                value={sendForm.phone}
                onChange={(e) => setSendForm({ ...sendForm, phone: e.target.value })}
              />
            </div>
            <Button onClick={handleSendOtp} className="bg-purple-600 hover:bg-purple-700">
              Send OTP
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={handleVerifyOtp} variant="outline">
                Verify OTP
              </Button>
            </div>
          </div>
        </section>

        <aside className="bg-[#1a1a1a] rounded-xl p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="text-sm text-gray-300">
            <div>Event: {eventId}</div>
            <div>Total: {(totalAmount || 0).toLocaleString()}</div>
          </div>
          {message && <div className="text-sm text-yellow-400">{message}</div>}
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button
            onClick={handleCheckout}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Creating checkout..." : "Proceed to Polar Checkout"}
          </Button>
        </aside>
      </div>
    </main>
  );
}
