import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * DarkModeToggle — A premium theme switch component.
 * Renders an animated track and slide button containing sun/moon icons
 * and states the current theme mode as text.
 */
export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Visual toggle track */}
      <button
        onClick={toggleTheme}
        type="button"
        className="group relative flex h-7 w-12 shrink-0 cursor-pointer rounded-full bg-gray-200 p-0.5 transition-colors duration-300 focus:outline-none dark:bg-gray-700"
        aria-label="Toggle Theme Mode"
      >
        {/* Sliding circle */}
        <span
          className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white text-amber-500 shadow-sm transition-all duration-300 dark:bg-gray-900 dark:text-blue-400 ${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDarkMode ? (
            <Moon className="h-3.5 w-3.5 transition-transform duration-300 rotate-12" />
          ) : (
            <Sun className="h-3.5 w-3.5 transition-transform duration-300 rotate-0" />
          )}
        </span>
      </button>
      {/* Mode label text */}
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </div>
  );
}
