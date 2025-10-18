import { useEffect, useState } from "react";
import axios from "axios";
import { eventEndpoints, adminEndpoints } from "@/services/api";
import { EventForm, EventTable } from "./index";
import { Button } from "@/components/ui/button";

export default function ManageEvents() {
   const [events, setEvents] = useState([]);
  const [mode, setMode] = useState<"table" | "add" | "edit" | "view">("table");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // ✅ Fetch all events
  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(eventEndpoints.getAllEvents);
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Delete event
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(adminEndpoints.deleteEvent(id), { withCredentials: true });
      fetchEvents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Add / Edit / View handlers
  const handleAdd = () => {
    setSelectedEvent(null);
    setMode("add");
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setMode("edit");
  };

  const handleView = (event: any) => {
    setSelectedEvent(event);
    setMode("view");
  };

  const handleCancel = () => {
    setSelectedEvent(null);
    setMode("table");
  };

  const handleSuccess = () => {
    fetchEvents();
    setSelectedEvent(null);
    setMode("table");
  };

  return (
    <div className="p-4 w-full">
      {/* Header */}
      {mode === "table" && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Events</h1>
          <Button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700"
          >
            + Add Event
          </Button>
        </div>
      )}

      {/* Event Table */}
      {mode === "table" && (
        <EventTable
          events={events}
          onEdit={handleEdit}
          onView={handleView} // ✅ added
          onDelete={handleDelete}
        />
      )}

      {/* Event Form */}
      {(mode === "add" || mode === "edit" || mode === "view") && (
        <EventForm
          mode={mode === "add" ? "add" : mode === "edit" ? "edit" : "view"}
          initialData={selectedEvent}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
