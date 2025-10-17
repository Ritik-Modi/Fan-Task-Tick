import { useEffect, useState } from "react";
import axios from "axios";
import { eventEndpoints, adminEndpoints } from "@/services/api";
import { EventForm, EventTable } from "./";
import { Button } from "@/components/ui/button";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const fetchEvents = async () => {
    const { data } = await axios.get(eventEndpoints.getAllEvents);
    console.log(data)
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(adminEndpoints.deleteEvent(id), { withCredentials: true });
    fetchEvents();
  };

  const handleEdit = (event: any) => {
    setEditData(event);
    setShowForm(true);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          + Add Event
        </Button>
      </div>

      {showForm ? (
        <EventForm
          mode={editData ? "edit" : "add"}
          initialData={editData}
          onSuccess={() => {
            setShowForm(false);
            fetchEvents();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <EventTable events={events} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
