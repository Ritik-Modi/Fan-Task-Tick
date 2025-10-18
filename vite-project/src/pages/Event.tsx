import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchEventById } from "@/store/eventSlice";
import { getTicketsByEvent } from "@/store/ticketSlice";
import { CalendarDays, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Event() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { eventDetails, loading: eventLoading } = useAppSelector(
    (state) => state.event
  );
  const { tickets = [], loading: ticketLoading, error: ticketError } = useAppSelector(
  (state) => state.ticket
);

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(getTicketsByEvent(id));
    }
    console.log(eventDetails?.tickets);
  }, [dispatch, id]);

  const loading = eventLoading || ticketLoading;

const totalAmount = useMemo(() => {
  return tickets.reduce((total, ticket) => {
    const qty = selectedTickets[ticket._id] || 0;
    return total + ticket.price * qty;
  }, 0);
}, [selectedTickets, tickets]);

  const handleQuantityChange = (ticketId: string, value: string) => {
    const qty = Math.max(0, Number(value));
    setSelectedTickets((prev) => ({ ...prev, [ticketId]: qty }));
  };

  const handleProceedToPayment = () => {
    const selected = tickets
      .filter((t) => selectedTickets[t._id] > 0)
      .map((t) => ({
        ticketId: t._id,
        quantity: selectedTickets[t._id],
        price: t.price,
      }));

    if (selected.length === 0) {
      alert("Please select at least one ticket before proceeding.");
      return;
    }

    navigate("/payment", { state: { eventId: id, selected, totalAmount } });
  };

  if (loading || !eventDetails) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-center">
        <div>
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(eventDetails.startDate).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const minPrice =
    tickets?.length > 0 ? Math.min(...tickets.map((t) => t.price)) : null;
  const maxPrice =
    tickets?.length > 0 ? Math.max(...tickets.map((t) => t.price)) : null;

  return (
    <main className="min-h-screen w-full bg-[#0f0f0f] text-white py-16 px-4 sm:px-8 lg:px-16">
      {/* === Hero Image === */}
      <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg">
        <img
          src={eventDetails.image}
          alt={eventDetails.title}
          className="w-full h-[400px] object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold mb-2">{eventDetails.title}</h1>
          <p className="text-gray-300">{eventDetails.venue}</p>
        </div>
      </div>

      {/* === Event Info Section === */}
      <div className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* === Left: Details === */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Event Details</h2>
            <p className="text-gray-400 leading-relaxed">
              {eventDetails.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {eventDetails.genreIds?.map((g: any) => (
              <Badge key={g._id} variant="secondary">
                {g.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 text-gray-300">
              <CalendarDays className="w-5 h-5 text-purple-500" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span>{eventDetails.venue}</span>
            </div>

            {minPrice !== null && (
              <div className="flex items-center gap-3 text-gray-300">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <span>
                  Price Range: ₹{minPrice}
                  {maxPrice !== null && maxPrice !== minPrice && ` - ₹${maxPrice}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* === Right: Tickets Section === */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 flex flex-col gap-6 shadow-lg">
          <h2 className="text-xl font-semibold">Available Tickets</h2>
          {ticketError ? (
            <p className="text-red-400">Failed to load tickets.</p>
          ) : tickets?.length === 0 ? (
            <p className="text-gray-400">No tickets available right now.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#222] p-4 rounded-lg hover:bg-[#2a2a2a] transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <p className="text-sm text-gray-400">
                      {ticket.description || "Standard ticket"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.statusbar === "inactive"
                        ? "Not on sale"
                        : "Available"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
                    <span className="text-purple-400 font-semibold">
                      ₹{ticket.price}
                    </span>

                    {/* === Custom Quantity Selector === */}
                    <div className="flex items-center gap-3">
                      {/* ➖ Minus */}
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            ticket._id,
                            String((selectedTickets[ticket._id] || 0) - 1)
                          )
                        }
                        disabled={(selectedTickets[ticket._id] || 0) <= 0}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] text-gray-300 border border-gray-600 hover:bg-[#2a2a2a] hover:text-white transition disabled:opacity-40"
                      >
                        −
                      </button>

                      {/* Quantity */}
                      <span className="w-6 text-center text-white font-medium">
                        {selectedTickets[ticket._id] || 0}
                      </span>

                      {/* ➕ Plus */}
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            ticket._id,
                            String((selectedTickets[ticket._id] || 0) + 1)
                          )
                        }
                        disabled={
                          (selectedTickets[ticket._id] || 0) >= ticket.quantity ||
                          ticket.statusbar === "inactive"
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] text-gray-300 border border-gray-600 hover:bg-[#2a2a2a] hover:text-white transition disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === Total & Proceed === */}
          {tickets?.length > 0 && (
            <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-lg font-semibold text-gray-300">
                Total:{" "}
                <span className="text-purple-400">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              <Button
                onClick={handleProceedToPayment}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2"
                disabled={totalAmount <= 0}
              >
                Proceed to Payment →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* === Back Button === */}
      <div className="flex justify-center mt-12">
        <Button
          variant="outline"
          onClick={() => navigate("/events")}
          className="border-gray-700 text-gray-300 hover:text-white hover:border-purple-500 bg-black"
        >
          ← Back to Events
        </Button>
      </div>
    </main>
  );
}

export default Event;
