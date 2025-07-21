import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchEventById } from "@/store/eventSlice";
import { getTicketsByEvent } from "@/store/ticketSlice";
import { CalendarDays, MapPin, DollarSign, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Event() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const { eventDetails, loading: eventLoading } = useAppSelector((state) => state.event);
  const { tickets, loading: ticketLoading } = useAppSelector((state) => state.ticket);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id)).then((action)=>{
        console.log(action)
      });
      dispatch(getTicketsByEvent(id));
    }
  }, [dispatch, id]);

  const loading = eventLoading || ticketLoading;

  if (loading || !eventDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-pulse">
            <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading event details...</p>
          </div>
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

  const minPrice = tickets.length > 0 ? Math.min(...tickets.map(t => t.price)) : 0;
  
  // Debug logging
  console.log('Event Details:', eventDetails);
  console.log('Tickets:', tickets);
  const maxPrice = tickets.length > 0 ? Math.max(...tickets.map(t => t.price)) : 0;

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
      <div className="max-w-6xl mx-auto">
        {/* Event Header */}
        <div className="bg-gray-800/50 glass rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Image */}
            <div className="relative">
              <img
                src={eventDetails.image}
                alt={eventDetails.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-mint text-black font-semibold">
                  {tickets.length} Ticket Types
                </Badge>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-4">{eventDetails.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{eventDetails.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-mint" />
                  <div>
                    <span className="text-white font-semibold">Event Date:</span>
                    <span className="text-gray-300 ml-2">{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-mint" />
                  <div>
                    <span className="text-white font-semibold">Venue:</span>
                    <span className="text-gray-300 ml-2">{eventDetails.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-mint" />
                  <div>
                    <span className="text-white font-semibold">Price Range:</span>
                    <span className="text-mint font-bold ml-2">
                      ₹{minPrice} - ₹{maxPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {eventDetails.genreIds.map((g) => (
                  <Badge key={g._id} variant="secondary" className="bg-mint/20 text-mint border-mint/30">
                    {g.name}
                  </Badge>
                ))}
              </div>

              <Button 
                className="btn-primary text-lg px-8 py-3 w-fit"
                onClick={() => navigate(`/ticket/${eventDetails._id}`)}
              >
                View Tickets & Book
              </Button>
            </div>
          </div>
        </div>

        {/* Tickets Preview */}
        {tickets.length > 0 && (
          <div className="bg-gray-800/50 glass rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Available Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.slice(0, 3).map((ticket) => (
                <div
                  key={ticket._id}
                  className="dashboard-card bg-gray-700/50 rounded-lg p-6 border border-white/10 hover:border-mint/30 transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2">{ticket.title}</h3>
                    <p className="text-gray-400 text-sm">{ticket.description}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-mint" />
                      <span className="text-white font-semibold">₹{ticket.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-mint" />
                      <span className="text-gray-300 text-sm">{ticket.quantity} available</span>
                    </div>

                    {ticket.startSession && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-mint" />
                        <span className="text-gray-300 text-sm">
                          {formatDateTime(ticket.startSession)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
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
              ))}
            </div>

            {tickets.length > 3 && (
              <div className="text-center mt-6">
                <Button 
                  onClick={() => navigate(`/ticket/${eventDetails._id}`)}
                  className="btn-outline"
                >
                  View All {tickets.length} Tickets
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Guarantee Banner */}
        <div className="text-center bg-gradient-to-r from-mint/10 to-blue-500/10 rounded-xl p-8 border border-mint/20">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">LOWEST PRICE</span> GUARANTEE
          </h2>
          <p className="text-gray-300 text-lg">
            If you find a lower price online, we'll match it!
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-mint">100%</div>
              <div className="text-gray-400 text-sm">Secure Booking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mint">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mint">Instant</div>
              <div className="text-gray-400 text-sm">Confirmation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
