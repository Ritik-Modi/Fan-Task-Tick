// src/components/admin/EventForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { adminEndpoints, genreEndpoints, ticketEndpoints } from "@/services/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Upload, Edit3 } from "lucide-react";

interface Ticket {
  _id?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
  startSession: string;
  endSession: string;
  statusbar?: "active" | "inactive" | "sold out";
}

interface EventFormProps {
  mode: "add" | "edit" | "view";
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ mode, initialData, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    startDate: "",
    endDate: "",
    genreIds: [] as string[],
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(mode !== "view");

  // ✅ Analytics
  const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const soldTickets = tickets.reduce((sum, t) => sum + (t.sold || 0), 0);
  const remainingTickets = totalTickets - soldTickets;
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.price * (t.sold || 0)), 0);

  // ✅ Fetch genres
  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(genreEndpoints.getAllGenres);
      setGenres(data || []);
    } catch (err) {
      console.error("Failed to fetch genres", err);
    }
  };

  // ✅ Fetch tickets
  const fetchTickets = async (eventId: string) => {
    try {
      const { data } = await axios.get(ticketEndpoints.getTicketsByEvent(eventId), {
        withCredentials: true,
      });
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    const initForm = async () => {
      await fetchGenres();
      if ((mode === "edit" || mode === "view") && initialData) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          venue: initialData.venue || "",
          startDate: initialData.startDate?.slice(0, 10) || "",
          endDate: initialData.endDate?.slice(0, 10) || "",
          genreIds: (initialData.genreIds || []).map((g: any) =>
            typeof g === "string" ? g : g._id
          ),
          image: null,
        });
        if (initialData.image) setImagePreview(initialData.image);
        await fetchTickets(initialData._id);
      }
    };
    initForm();
  }, [mode, initialData]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isEditable) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (id: string) => {
    if (!isEditable) return;
    setFormData((prev) => {
      const exists = prev.genreIds.includes(id);
      const newGenres = exists ? prev.genreIds.filter((g) => g !== id) : [...prev.genreIds, id];
      return { ...prev, genreIds: newGenres };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Ticket logic
  const addTicket = () => {
    if (!isEditable) return;
    setTickets((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        startSession: "",
        endSession: "",
        statusbar: "active",
      },
    ]);
  };

  const updateTicket = (index: number, key: keyof Ticket, value: any) => {
    if (!isEditable) return;
    setTickets((prev) => prev.map((t, i) => (i === index ? { ...t, [key]: value } : t)));
  };

  const removeTicket = async (index: number) => {
    if (!isEditable) return;
    const ticket = tickets[index];
    if (ticket._id && initialData?._id) {
      await axios.delete(ticketEndpoints.deleteTicket(initialData._id, ticket._id), {
        withCredentials: true,
      });
    }
    setTickets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable) return;

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "genreIds") payload.append("genreIds", JSON.stringify(val));
        else if (val) payload.append(key, val as any);
      });

      let eventId = initialData?._id;

      if (mode === "add") {
        const { data } = await axios.post(adminEndpoints.createEvent, payload, {
          withCredentials: true,
        });
        eventId = data.event._id;
      } else if (mode === "edit" && eventId) {
        await axios.put(adminEndpoints.updateEvent(eventId), payload, { withCredentials: true });
      }

      if (tickets.length > 0 && eventId) {
        for (const ticket of tickets) {
          if (ticket._id) {
            await axios.put(ticketEndpoints.updateTicket(eventId, ticket._id), ticket, {
              withCredentials: true,
            });
          } else {
            await axios.post(ticketEndpoints.createTicket(eventId), ticket, {
              withCredentials: true,
            });
          }
        }
      }

      onSuccess();
    } catch (err) {
      console.error("Event submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 text-white w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {mode === "add" ? "Add New Event" : mode === "view" ? "Event Details" : "Edit Event"}
        </h2>

        {mode === "view" && !isEditable && (
          <Button
            onClick={() => setIsEditable(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit
          </Button>
        )}
      </div>

      {/* ✅ Analytics for View Mode */}
      {mode === "view" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Total Tickets</p>
            <h3 className="text-white text-xl font-semibold">{totalTickets}</h3>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Sold</p>
            <h3 className="text-green-400 text-xl font-semibold">{soldTickets}</h3>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Remaining</p>
            <h3 className="text-yellow-400 text-xl font-semibold">{remainingTickets}</h3>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Revenue</p>
            <h3 className="text-purple-400 text-xl font-semibold">₹{totalRevenue}</h3>
          </div>
        </div>
      )}

      {/* ✅ Full Form (unchanged design) */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Image Upload */}
        <div className="relative mb-6 flex flex-col items-center border border-dashed border-gray-600 rounded-lg p-4 bg-[#111] hover:border-purple-500 transition">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-cover rounded-md mb-3" />
          ) : (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <Upload size={40} className="mb-2 text-purple-400" />
              <p className="text-sm">Drag & Drop or Click to Upload Image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!isEditable}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-sm text-gray-400">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
            disabled={!isEditable}
            className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            required
            disabled={!isEditable}
            className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none resize-none"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="text-sm text-gray-400">Venue</label>
          <input
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Venue"
            required
            disabled={!isEditable}
            className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none"
          />
        </div>

        {/* Dates */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={!isEditable}
              className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-400">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={!isEditable}
              className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md"
            />
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Select Genres</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-gray-800 rounded-lg p-3 bg-[#111]">
            {genres.map((genre) => (
              <button
                key={genre._id}
                type="button"
                onClick={() => handleGenreToggle(genre._id)}
                disabled={!isEditable}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  formData.genreIds.includes(genre._id)
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-gray-600 text-gray-300 hover:border-purple-500 hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Section */}
        <div className="mt-6 border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Tickets</h3>
            {isEditable && (
              <Button
                type="button"
                onClick={addTicket}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <PlusCircle size={18} /> Add Ticket
              </Button>
            )}
          </div>

          {tickets.length === 0 && (
            <p className="text-sm text-gray-400">No tickets added yet.</p>
          )}

          <div className="flex flex-col gap-4">
            {tickets.map((ticket, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#111] border border-gray-700 p-4 rounded-xl"
              >
                <div>
                  <label className="text-xs text-gray-400">Ticket Title</label>
                  <input
                    type="text"
                    value={ticket.title}
                    onChange={(e) => updateTicket(index, "title", e.target.value)}
                    placeholder="VIP / Regular..."
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Description</label>
                  <input
                    type="text"
                    value={ticket.description}
                    onChange={(e) => updateTicket(index, "description", e.target.value)}
                    placeholder="Ticket description..."
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={ticket.price || ""}
                    onChange={(e) => updateTicket(index, "price", Number(e.target.value))}
                    placeholder="Enter price"
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={ticket.quantity || ""}
                    onChange={(e) => updateTicket(index, "quantity", Number(e.target.value))}
                    placeholder="Enter quantity"
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Status</label>
                  <select
                    value={ticket.statusbar || "active"}
                    onChange={(e) => updateTicket(index, "statusbar", e.target.value)}
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold out">Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400">Start Session</label>
                  <input
                    type="datetime-local"
                    value={ticket.startSession}
                    onChange={(e) => updateTicket(index, "startSession", e.target.value)}
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">End Session</label>
                  <input
                    type="datetime-local"
                    value={ticket.endSession}
                    onChange={(e) => updateTicket(index, "endSession", e.target.value)}
                    disabled={!isEditable}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                {isEditable && (
                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      onClick={() => removeTicket(index)}
                      className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                      <Trash2 size={16} /> Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white bg-black hover:border-purple-500"
          >
            Cancel
          </Button>

          {isEditable && (
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Saving..." : mode === "add" ? "Create Event" : "Update Event"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
