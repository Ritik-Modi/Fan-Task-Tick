import { useAppSelector } from "@/store/hook";
import { Check } from "lucide-react";

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenreChange: (genreIds: string[]) => void;
}

function GenreSelector({ selectedGenres, onGenreChange }: GenreSelectorProps) {
  const { genres } = useAppSelector((state) => state.genre);

  const handleGenreToggle = (genreId: string) => {
    const isSelected = selectedGenres.includes(genreId);
    if (isSelected) {
      onGenreChange(selectedGenres.filter(id => id !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-2">Select Genres *</label>
      {genres.length === 0 ? (
        <p className="text-lightgray text-sm">No genres available. Please create genres first.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {genres.map((genre) => (
            <button
              key={genre._id}
              type="button"
              onClick={() => handleGenreToggle(genre._id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                selectedGenres.includes(genre._id)
                  ? "border-mint bg-mint/20 text-mint"
                  : "border-white/20 bg-gray-800 text-white hover:border-mint/50"
              }`}
            >
              <span className="text-sm font-medium">{genre.name}</span>
              {selectedGenres.includes(genre._id) && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}
      {selectedGenres.length > 0 && (
        <p className="text-sm text-lightgray">
          Selected: {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default GenreSelector; 