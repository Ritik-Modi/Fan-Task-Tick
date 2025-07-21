import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createEvent, updateEvent, deleteEvent, fetchAdminEvents } from "@/store/adminSlice";
import { createTicket } from "@/store/ticketSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Edit, Trash2, Plus, X, Tag, Upload, DollarSign } from "lucide-react";
import GenreSelector from "./GenreSelector";
import InlineTicketManager from "./InlineTicketManager";
import DateTimePicker from "@/components/ui/date-time-picker";
import { useNotification } from "@/components/ui/notification-provider";
import { getCurrentDateTime } from "@/components/ui/date-time-picker";

// Types
interface AdminEvent {
  _id: string;
  title: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  image: string;
  createdBy: string;
  genreIds?: Array<{ _id: string; name: string }>;
}

interface EventFormData {
  title: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  image: File | null;
  imagePreview: string;
  genreIds: string[];
}

interface TicketFormData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  startSession: string;
  endSession: string;
}

function EventManager() {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    description: "",
    venue: "",
    startDate: getCurrentDateTime(),
    endDate: getCurrentDateTime(),
    image: null,
    imagePreview: "",
    genreIds: [],
  });
  const [tickets, setTickets] = useState<TicketFormData[]>([]);

  const { events, loading, error } = useAppSelector((state) => state.admin);
  const { loading: adminLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminEvents());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventForm({
        ...eventForm,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('venue', eventForm.venue);
    formData.append('startDate', eventForm.startDate);
    formData.append('endDate', eventForm.endDate);
    formData.append('genreIds', JSON.stringify(eventForm.genreIds));
    
    if (eventForm.image) {
      formData.append('image', eventForm.image);
    }

    try {
      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent._id, data: formData }));
        showNotification('success', 'Event updated successfully!');
      } else {
        // Create event first
        console.log('Creating event with formData:', formData);
        const result = await dispatch(createEvent(formData));
        console.log('Event creation result:', result);
        
        if (createEvent.fulfilled.match(result)) {
          const eventId = result.payload._id;
          console.log('Event created with ID:', eventId);
          console.log('Tickets to create:', tickets);
          
          // Only create tickets if there are any
          if (tickets.length > 0) {
            // Create tickets for the new event
            for (const ticket of tickets) {
              console.log('Creating ticket:', ticket);
              const ticketData = {
                eventId,
                title: ticket.title,
                description: ticket.description,
                price: ticket.price,
                quantity: ticket.quantity,
                startSession: new Date(ticket.startSession).toISOString(),
                endSession: new Date(ticket.endSession).toISOString(),
                statusbar: 'active' as const
              };
              console.log('Ticket data being sent:', ticketData);
              const ticketResult = await dispatch(createTicket({
                eventId,
                data: ticketData
              }));
              console.log('Ticket creation result:', ticketResult);
              
              if (createTicket.rejected.match(ticketResult)) {
                console.error('Ticket creation failed:', ticketResult.payload);
                showNotification('error', `Failed to create ticket: ${ticket.title}`);
              }
            }
            showNotification('success', `Event "${eventForm.title}" created successfully with ${tickets.length} tickets!`);
          } else {
            showNotification('success', `Event "${eventForm.title}" created successfully!`);
          }
          
          // Refresh the events list to show the new event at the top
          await dispatch(fetchAdminEvents());
        } else {
          console.error('Event creation failed:', result);
          showNotification('error', 'Failed to create event');
        }
      }
    } catch (error) {
      showNotification('error', 'Failed to save event. Please try again.');
    }
    resetForm();
  };

  const handleEditEvent = (event: AdminEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      venue: event.venue,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      image: null,
      imagePreview: event.image,
      genreIds: event.genreIds || [],
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await dispatch(deleteEvent(eventId));
    setDeletingEvent(null);
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      venue: "",
      startDate: "",
      endDate: "",
      image: null,
      imagePreview: "",
      genreIds: [],
    });
    setTickets([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Event Management</h2>
        <Button onClick={() => setShowEventForm(true)} className="bg-mint text-black hover:bg-mint/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-lightgray">No events found.</p>
            ) : (
        <div className="grid gap-4">
          <p className="text-sm text-gray-400 mb-4">Debug: {events.length} events loaded</p>
          {events.map((event) => (
            <div key={event._id} className="border border-white/20 p-6 rounded-lg bg-gray-800 hover:bg-gray-750 transition">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                {/* Event Image */}
                <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300/1e1e1e/cccccc?text=Event+Image';
                    }}
                  />
                </div>

                {/* Event Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-lightgray text-sm leading-relaxed">{event.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-mint" />
                      <span className="text-white font-medium">Venue:</span>
                      <span className="text-lightgray">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-mint" />
                      <span className="text-white font-medium">Date:</span>
                      <span className="text-lightgray">{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-mint" />
                      <span className="text-white font-medium">Genres:</span>
                      <span className="text-lightgray">
                        {event.genreIds?.map((g: { name: string }) => g.name).join(", ") || "No genres"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-mint" />
                      <span className="text-white font-medium">Tickets:</span>
                      <span className="text-lightgray">
                        {event.tickets?.length || 0} types available
                        {event.tickets && event.tickets.length > 0 && (
                          <span className="ml-2 text-xs">(Debug: {JSON.stringify(event.tickets.map(t => t.title))})</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEditEvent(event)}
                      variant="outline"
                      size="sm"
                      className="border-mint text-mint hover:bg-mint hover:text-black"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Event
                    </Button>
                    <Button
                      onClick={() => setDeletingEvent(event._id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkgray rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h3>
              <Button onClick={resetForm} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-6">
              {/* Event Details Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-mint border-b border-mint/30 pb-2">Event Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Event Title *</label>
                    <Input
                      placeholder="Enter event title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Venue *</label>
                    <Input
                      placeholder="Enter venue"
                      value={eventForm.venue}
                      onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description *</label>
                  <textarea
                    placeholder="Enter event description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full p-3 rounded-md bg-gray-800 border border-white/20 text-white resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Start Date *</label>
                    <Input
                      type="date"
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">End Date *</label>
                    <Input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Genre Selection */}
                <GenreSelector
                  selectedGenres={eventForm.genreIds}
                  onGenreChange={(genreIds) => setEventForm({ ...eventForm, genreIds })}
                />

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Event Image *</label>
                  <div className="space-y-3">
                    {eventForm.imagePreview && (
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-white/20">
                        <img 
                          src={eventForm.imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          onClick={() => setEventForm({ ...eventForm, image: null, imagePreview: "" })}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 w-6 h-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 border border-mint text-mint rounded-md cursor-pointer hover:bg-mint hover:text-black transition">
                        <Upload className="w-4 h-4" />
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required={!eventForm.imagePreview}
                        />
                      </label>
                      {!eventForm.imagePreview && (
                        <span className="text-sm text-lightgray">Please select an image for the event</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets Section */}
              <InlineTicketManager
                tickets={tickets}
                onTicketsChange={setTickets}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-mint text-black hover:bg-mint/90" disabled={adminLoading}>
                  {adminLoading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkgray rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-lightgray mb-4">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteEvent(deletingEvent)}
                variant="destructive"
                className="flex-1"
                disabled={adminLoading}
              >
                {adminLoading ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setDeletingEvent(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventManager; 