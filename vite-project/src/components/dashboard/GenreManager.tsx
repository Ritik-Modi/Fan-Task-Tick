import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addGenre, removeGenre } from "@/store/adminSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, X, Music } from "lucide-react";

interface Genre {
  _id: string;
  name: string;
}

function GenreManager() {
  const dispatch = useAppDispatch();
  const [showGenreForm, setShowGenreForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<string | null>(null);
  const [genreForm, setGenreForm] = useState({ name: "" });

  const { genres, loading: genreLoading } = useAppSelector((state) => state.genre);
  const { loading: adminLoading } = useAppSelector((state) => state.admin);

  const handleGenreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGenre) {
      // Note: Update genre functionality would need to be added to the backend
      console.log("Update genre:", { id: editingGenre._id, name: genreForm.name });
    } else {
      await dispatch(addGenre({ name: genreForm.name }));
    }
    setShowGenreForm(false);
    setEditingGenre(null);
    setGenreForm({ name: "" });
  };

  const handleEditGenre = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreForm({ name: genre.name });
    setShowGenreForm(true);
  };

  const handleDeleteGenre = async (genreId: string) => {
    await dispatch(removeGenre(genreId));
    setDeletingGenre(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Genre Management</h2>
        <Button onClick={() => setShowGenreForm(true)} className="bg-mint text-black hover:bg-mint/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Genre
        </Button>
      </div>

      {genreLoading ? (
        <p className="text-center">Loading genres...</p>
      ) : genres.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
          <Music className="w-12 h-12 text-lightgray mx-auto mb-3" />
          <p className="text-lightgray mb-2">No genres found</p>
          <p className="text-sm text-lightgray">Click "Add Genre" to create your first genre</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {genres.map((genre) => (
            <div key={genre._id} className="border border-white/20 p-4 rounded-lg bg-gray-800 hover:bg-gray-750 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-mint/20 rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{genre.name}</h3>
                    <p className="text-sm text-lightgray">Genre ID: {genre._id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditGenre(genre)}
                    variant="outline"
                    size="sm"
                    className="border-mint text-mint hover:bg-mint hover:text-black"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeletingGenre(genre._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Genre Form Modal */}
      {showGenreForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkgray rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingGenre ? "Edit Genre" : "Add New Genre"}
              </h3>
              <Button onClick={() => setShowGenreForm(false)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleGenreSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Genre Name *</label>
                <Input
                  placeholder="Enter genre name"
                  value={genreForm.name}
                  onChange={(e) => setGenreForm({ name: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 bg-mint text-black hover:bg-mint/90" disabled={adminLoading}>
                  {adminLoading ? "Saving..." : editingGenre ? "Update Genre" : "Add Genre"}
                </Button>
                <Button type="button" onClick={() => setShowGenreForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Genre Delete Confirmation Modal */}
      {deletingGenre && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkgray rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-lightgray mb-4">Are you sure you want to delete this genre? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteGenre(deletingGenre)}
                variant="destructive"
                className="flex-1"
                disabled={adminLoading}
              >
                {adminLoading ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setDeletingGenre(null)}
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

export default GenreManager; 