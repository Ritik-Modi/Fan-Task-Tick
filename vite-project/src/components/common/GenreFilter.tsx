import { Tags } from "lucide-react";

interface Genre {
  id: string;
  name: string;
}

interface GenreFilterProps {
  genres: Genre[];
  selected: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  onFocus?: () => void; // ✅ Already correct
}

function GenreFilter({
  genres,
  selected,
  onChange,
  icon = <Tags className="w-4 h-4" />,
  onFocus, // ✅ Add this to destructuring too
}: GenreFilterProps) {
  return (
    <div className="relative w-full max-w-md">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus} // ✅ THIS LINE IS THE FIX
        className="w-full pl-4 pr-10 py-2 rounded-full text-white bg-darkgray appearance-none"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </span>
    </div>
  );
}

export default GenreFilter;
