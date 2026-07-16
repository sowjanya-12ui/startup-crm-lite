import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar - A controlled search input with debouncing and clear button.
 * 
 * Features:
 * - Debounced input (300ms delay) for better performance
 * - Search icon (magnifying glass from Lucide React)
 * - Clear button (X icon) appears when there is text
 * - Accessible with aria-label
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {function} props.onChange - Callback when search value changes (after debounce)
 * @returns {JSX.Element}
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce effect: wait 300ms after user stops typing before calling onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Handle clear button click
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-text-secondary dark:text-text-secondary" />
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads"
        className="block w-full rounded-xl border border-border-main bg-surface py-2.5 pl-10 pr-10 text-sm text-text-main placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {/* Clear button - shows only when there is text */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary dark:text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
