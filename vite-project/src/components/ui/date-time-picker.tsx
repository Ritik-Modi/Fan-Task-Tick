import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'date' | 'datetime-local' | 'time';
  required?: boolean;
  placeholder?: string;
  className?: string;
}

function DateTimePicker({
  label,
  value,
  onChange,
  type = 'datetime-local',
  required = false,
  placeholder,
  className = ''
}: DateTimePickerProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'time':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return '';
    
    try {
      const date = new Date(value);
      if (type === 'date') {
        return date.toLocaleDateString();
      } else if (type === 'time') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleString();
      }
    } catch {
      return value;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className={`relative group ${isFocused ? 'ring-2 ring-mint ring-opacity-50' : ''}`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mint z-10">
          {getIcon()}
        </div>
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-mint transition-all duration-200"
        />
        
        {/* Display formatted value overlay for better UX */}
        {value && (
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none">
            <span className="text-sm">{formatDisplayValue(value)}</span>
          </div>
        )}
      </div>
      
      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-400">
        {type === 'date' && 'Select a date'}
        {type === 'time' && 'Select a time'}
        {type === 'datetime-local' && 'Select date and time'}
      </p>
    </div>
  );
}

// Quick date/time helpers
export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

export default DateTimePicker; 