import { useState, useEffect } from "react";
import axios from "axios";
import { adminEndpoints, genreEndpoints } from "@/services/api";
import { Button } from "@/components/ui/button";

interface EventFormProps {
  mode: "add" | "edit";
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

  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data } = await axios.get(genreEndpoints.getAllGenres);
      setGenres(data.genres || []);
    };
    fetchGenres();

    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        venue: initialData.venue,
        startDate: initialData.startDate?.slice(0, 10),
        endDate: initialData.endDate?.slice(0, 10),
        genreIds: initialData.genreIds?.map((g: any) => g._id) || [],
        image: null,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.genreIds.includes(id);
      const newGenres = exists ? prev.genreIds.filter((g) => g !== id) : [...prev.genreIds, id];
      return { ...prev, genreIds: newGenres };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "genreIds") {
        payload.append("genreIds", JSON.stringify(val));
      } else if (val) {
        payload.append(key, val as any);
      }
    });

    try {
      if (mode === "add") {
        await axios.post(adminEndpoints.createEvent, payload, { withCredentials: true });
      } else if (mode === "edit" && initialData?._id) {
        await axios.put(adminEndpoints.updateEvent(initialData._id), payload, { withCredentials: true });
      }
      onSuccess();
    } catch (error) {
      console.error("Event submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 text-white w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "add" ? "Add New Event" : "Edit Event"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
          required
          className="px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          required
          className="px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none resize-none"
        />
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="Venue"
          required
          className="px-4 py-2 bg-[#111] border border-gray-700 rounded-md focus:border-purple-500 outline-none"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
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
              className="w-full px-4 py-2 bg-[#111] border border-gray-700 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre._id}
                type="button"
                onClick={() => handleGenreToggle(genre._id)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  formData.genreIds.includes(genre._id)
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-600 text-gray-300"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }))
          }
          className="mt-2 text-sm text-gray-300"
        />

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Saving..." : mode === "add" ? "Create Event" : "Update Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
