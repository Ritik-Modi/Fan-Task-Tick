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
  onFocus?: () => void;
  className?: string;
}

function GenreFilter({
  genres,
  selected,
  onChange,
  icon = <Tags className="w-4 h-4" />,
  onFocus,
  className = "",
}: GenreFilterProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full pl-4 pr-10 py-2.5 rounded-full bg-[#1a1a1a] text-white
                   border border-gray-700 placeholder-gray-500
                   focus:border-purple-600 focus:ring-2 focus:ring-purple-700
                   outline-none transition-all duration-200 appearance-none"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </span>
    </div>
  );
}

export default GenreFilter;
