import { Pencil, Trash2, Eye, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventTableProps {
  events?: any[];
  onEdit: (event: any) => void;
  onDelete: (id: string) => void;
  onView?: (event: any) => void;
}

export default function EventTable({ events = [], onEdit, onDelete, onView }: EventTableProps) {
  return (
    <div className="w-full border border-gray-800 rounded-xl bg-[#151515]">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800 bg-[#1a1a1a]">
        <h2 className="text-lg font-semibold text-white">All Events</h2>
        <p className="text-sm text-gray-400">
          Total: <span className="text-purple-400 font-medium">{events.length}</span>
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left text-gray-300 text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400">
            <tr>
              <th className="px-5 py-3 font-medium">Image</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Venue</th>
              <th className="px-5 py-3 font-medium">Start</th>
              <th className="px-5 py-3 font-medium">End</th>
              <th className="px-5 py-3 font-medium">Tickets</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="border-t border-gray-800 hover:bg-[#1e1e1e] transition cursor-pointer"
                  onClick={() => onView && onView(event)}
                >
                  <td className="px-5 py-3">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 object-cover rounded-md border border-gray-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-[#222] flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-white">{event.title}</td>
                  <td className="px-5 py-3">{event.venue}</td>
                  <td className="px-5 py-3">
                    {new Date(event.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    {new Date(event.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    {event.tickets?.length ? (
                      <div className="flex flex-col gap-1">
                        {event.tickets.slice(0, 2).map((ticket: any, i: number) => (
                          <div key={i} className="text-xs text-gray-400">
                            🎟 {ticket.title} — ₹{ticket.price} ({ticket.quantity})
                          </div>
                        ))}
                        {event.tickets.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{event.tickets.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No tickets</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(event);
                          }}
                          className="bg-gray-700 hover:bg-gray-600"
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(event);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(event._id);
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-10 text-gray-500 text-sm" colSpan={7}>
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="block md:hidden p-3 space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              onClick={() => onView && onView(event)}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 shadow hover:bg-[#1e1e1e] transition-all"
            >
              {/* Image */}
              <div className="flex items-center gap-3 mb-3">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#222] flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin size={14} /> {event.venue}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />{" "}
                  {new Date(event.startDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />{" "}
                  {new Date(event.endDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              {/* Tickets */}
              {event.tickets?.length ? (
                <div className="text-xs text-gray-400 mb-3">
                  🎟 {event.tickets[0].title} — ₹{event.tickets[0].price}
                  {event.tickets.length > 1 && (
                    <span className="text-gray-500 ml-1">
                      (+{event.tickets.length - 1} more)
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mb-3">No tickets</p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-700">
                {onView && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(event);
                    }}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    <Eye size={14} />
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event._id);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-6">No events found.</p>
        )}
      </div>
    </div>
  );
}
