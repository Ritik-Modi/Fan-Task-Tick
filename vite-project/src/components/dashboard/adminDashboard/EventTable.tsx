import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventTableProps {
  events: any[];
  onEdit: (event: any) => void;
  onDelete: (id: string) => void;
}

export default function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  return (
    <div className="overflow-x-auto w-full border border-gray-800 rounded-xl">
      <table className="min-w-full text-left text-gray-300 text-sm">
        <thead className="bg-[#1a1a1a] text-gray-400">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Venue</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event._id} className="border-t border-gray-800 hover:bg-[#222]">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3">{event.venue}</td>
                <td className="px-4 py-3">{new Date(event.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(event.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <Button size="sm" onClick={() => onEdit(event)} className="bg-blue-600 hover:bg-blue-700">
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(event._id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center py-6 text-gray-500" colSpan={5}>
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
