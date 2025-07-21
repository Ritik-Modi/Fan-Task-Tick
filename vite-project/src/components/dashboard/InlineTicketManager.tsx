import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, X, DollarSign, Users, Clock } from "lucide-react";

interface TicketFormData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  startSession: string;
  endSession: string;
}

interface InlineTicketManagerProps {
  tickets: TicketFormData[];
  onTicketsChange: (tickets: TicketFormData[]) => void;
}

function InlineTicketManager({ tickets, onTicketsChange }: InlineTicketManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ticketForm, setTicketForm] = useState<TicketFormData>({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    startSession: "",
    endSession: "",
  });

  const handleAddTicket = () => {
    if (ticketForm.title && ticketForm.description && ticketForm.price > 0 && ticketForm.quantity > 0) {
      onTicketsChange([...tickets, ticketForm]);
      setTicketForm({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        startSession: "",
        endSession: "",
      });
      setShowAddForm(false);
    }
  };

  const handleEditTicket = (index: number) => {
    setEditingIndex(index);
    setTicketForm(tickets[index]);
  };

  const handleUpdateTicket = () => {
    if (editingIndex !== null && ticketForm.title && ticketForm.description && ticketForm.price > 0 && ticketForm.quantity > 0) {
      const newTickets = [...tickets];
      newTickets[editingIndex] = ticketForm;
      onTicketsChange(newTickets);
      setEditingIndex(null);
      setTicketForm({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        startSession: "",
        endSession: "",
      });
    }
  };

  const handleDeleteTicket = (index: number) => {
    onTicketsChange(tickets.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setShowAddForm(false);
    setTicketForm({
      title: "",
      description: "",
      price: 0,
      quantity: 0,
      startSession: "",
      endSession: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-mint/30 pb-2">
        <h4 className="text-lg font-semibold text-mint">Event Tickets</h4>
        {!showAddForm && editingIndex === null && (
          <Button 
            type="button" 
            onClick={() => setShowAddForm(true)} 
            variant="outline" 
            size="sm" 
            className="border-mint text-mint hover:bg-mint hover:text-black"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ticket
          </Button>
        )}
      </div>

      {/* Add/Edit Ticket Form */}
      {(showAddForm || editingIndex !== null) && (
        <div className="border border-mint/30 rounded-lg p-4 bg-gray-800/50">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-semibold text-white">
              {editingIndex !== null ? "Edit Ticket" : "Add New Ticket"}
            </h5>
            <Button onClick={handleCancel} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Ticket Title *</label>
              <Input
                placeholder="Enter ticket title"
                value={ticketForm.title}
                onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">Price (₹) *</label>
              <Input
                type="number"
                placeholder="0"
                value={ticketForm.price}
                onChange={(e) => setTicketForm({ ...ticketForm, price: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-white mb-1">Description *</label>
            <textarea
              placeholder="Enter ticket description"
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 border border-white/20 text-white resize-none"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Quantity *</label>
              <Input
                type="number"
                placeholder="0"
                value={ticketForm.quantity}
                onChange={(e) => setTicketForm({ ...ticketForm, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Start Session</label>
              <Input
                type="datetime-local"
                value={ticketForm.startSession}
                onChange={(e) => setTicketForm({ ...ticketForm, startSession: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">End Session</label>
              <Input
                type="datetime-local"
                value={ticketForm.endSession}
                onChange={(e) => setTicketForm({ ...ticketForm, endSession: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              type="button" 
              onClick={editingIndex !== null ? handleUpdateTicket : handleAddTicket}
              className="flex-1 bg-mint text-black hover:bg-mint/90"
            >
              {editingIndex !== null ? "Update Ticket" : "Add Ticket"}
            </Button>
            <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
          <DollarSign className="w-12 h-12 text-lightgray mx-auto mb-3" />
          <p className="text-lightgray mb-2">No tickets added yet</p>
          <p className="text-sm text-lightgray">Click "Add Ticket" to create tickets for this event</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket, index) => (
            <div key={index} className="border border-white/20 p-4 rounded-lg bg-gray-800 hover:bg-gray-750 transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h5 className="font-bold text-white text-lg mb-1">{ticket.title}</h5>
                  <p className="text-lightgray text-sm mb-3">{ticket.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    onClick={() => handleEditTicket(index)}
                    variant="ghost"
                    size="sm"
                    className="text-mint hover:text-mint/80"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDeleteTicket(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
                  <DollarSign className="w-4 h-4 text-mint" />
                  <div>
                    <span className="text-white font-medium">Price</span>
                    <p className="text-lightgray">₹{ticket.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
                  <Users className="w-4 h-4 text-mint" />
                  <div>
                    <span className="text-white font-medium">Quantity</span>
                    <p className="text-lightgray">{ticket.quantity} available</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
                  <Clock className="w-4 h-4 text-mint" />
                  <div>
                    <span className="text-white font-medium">Start</span>
                    <p className="text-lightgray">{ticket.startSession || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
                  <Clock className="w-4 h-4 text-mint" />
                  <div>
                    <span className="text-white font-medium">End</span>
                    <p className="text-lightgray">{ticket.endSession || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InlineTicketManager; 