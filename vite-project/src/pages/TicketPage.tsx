import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchEventById } from "@/store/eventSlice";
import { getTicketsByEvent } from "@/store/ticketSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Users, DollarSign, Calendar } from "lucide-react";

function TicketPage() {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { eventDetails, loading: eventLoading } = useAppSelector((state) => state.event);
  const { tickets, loading: ticketLoading, error } = useAppSelector((state) => state.ticket);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
      dispatch(getTicketsByEvent(eventId));
    }
  }, [dispatch, eventId]);

  const loading = eventLoading || ticketLoading;

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-mint hover:text-mint/80"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Event
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Available Tickets</h1>
            {eventDetails && (
              <p className="text-gray-400 mt-1">{eventDetails.title}</p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="loading-pulse">
              <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tickets...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-medium mb-2">Error Loading Tickets</p>
              <p className="text-gray-400 text-sm">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Tickets State */}
        {!loading && !error && tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tickets Available</h3>
              <p className="text-gray-400 mb-4">
                This event doesn't have any tickets available for purchase at the moment.
              </p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-mint text-black hover:bg-mint/90"
              >
                Back to Event
              </Button>
            </div>
          </div>
        )}

        {/* Tickets Grid */}
        {!loading && !error && tickets.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="dashboard-card bg-gray-800/50 glass rounded-xl p-6 border border-white/10 hover:border-mint/30 transition-all duration-300"
              >
                {/* Ticket Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{ticket.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{ticket.description}</p>
                </div>

                {/* Ticket Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-mint" />
                    <div>
                      <span className="text-white font-semibold">₹{ticket.price}</span>
                      <span className="text-gray-400 text-sm ml-2">per ticket</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-mint" />
                    <div>
                      <span className="text-white font-semibold">{ticket.quantity}</span>
                      <span className="text-gray-400 text-sm ml-2">available</span>
                    </div>
                  </div>

                  {ticket.startSession && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-mint" />
                      <div>
                        <span className="text-white font-semibold">Start:</span>
                        <span className="text-gray-400 text-sm ml-2">
                          {formatDateTime(ticket.startSession)}
                        </span>
                      </div>
                    </div>
                  )}

                  {ticket.endSession && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-mint" />
                      <div>
                        <span className="text-white font-semibold">End:</span>
                        <span className="text-gray-400 text-sm ml-2">
                          {formatDateTime(ticket.endSession)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-mint rounded-full"></div>
                    </div>
                    <div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        ticket.statusbar === 'active' 
                          ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                          : ticket.statusbar === 'sold out'
                          ? 'bg-red-900/30 text-red-400 border border-red-500/30'
                          : 'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                      }`}>
                        {ticket.statusbar === 'active' ? 'Available' : 
                         ticket.statusbar === 'sold out' ? 'Sold Out' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  className="w-full btn-primary"
                  disabled={ticket.statusbar !== 'active' || ticket.quantity === 0}
                >
                  {ticket.statusbar === 'active' && ticket.quantity > 0 
                    ? `Buy Ticket - ₹${ticket.price}`
                    : ticket.statusbar === 'sold out'
                    ? 'Sold Out'
                    : 'Not Available'
                  }
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && tickets.length > 0 && (
          <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Ticket Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Ticket Types:</span>
                <span className="text-white font-semibold ml-2">{tickets.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Available Tickets:</span>
                <span className="text-white font-semibold ml-2">
                  {tickets.reduce((sum, t) => sum + t.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Price Range:</span>
                <span className="text-white font-semibold ml-2">
                  ₹{Math.min(...tickets.map(t => t.price))} - ₹{Math.max(...tickets.map(t => t.price))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketPage;
