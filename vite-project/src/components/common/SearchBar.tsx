import { useRef } from "react";

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  onFocus?: () => void;
  className?: string;
}

function SearchBar({
  label,
  value,
  onChange,
  type = "text",
  icon,
  onFocus,
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWrapperClick = () => {
    if (type === "date") {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div
      className={`relative w-full ${className}`}
      onClick={handleWrapperClick}
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={label}
        className={`w-full px-4 pr-10 py-2.5 rounded-full
          bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700
          focus:border-purple-600 focus:ring-2 focus:ring-purple-700 outline-none
          transition-all duration-200
          ${type === "date" ? "[&::-webkit-calendar-picker-indicator]:opacity-0" : ""}
        `}
      />
      {icon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}
    </div>
  );
}

export default SearchBar;
