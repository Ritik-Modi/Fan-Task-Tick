import { useRef } from "react";

interface SearchBarProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  onFocus?: () => void;
}

function SearchBar({
  label,
  value,
  onChange,
  type = "text",
  icon,
  onFocus,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWrapperClick = () => {
    if (type === "date") {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker(); // ✅ open native picker in Chromium
      } else {
        inputRef.current?.focus(); // fallback
      }
    }
  };

  return (
    <div
      className="relative w-full max-w-md"
      onClick={handleWrapperClick}
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={label}
        className={`w-full px-4 pr-10 py-2 rounded-full text-white bg-darkgray appearance-none ${
          type === "date"
            ? "[&::-webkit-calendar-picker-indicator]:opacity-0"
            : ""
        }`}
      />
      {icon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {icon}
        </span>
      )}
    </div>
  );
}

export default SearchBar;
