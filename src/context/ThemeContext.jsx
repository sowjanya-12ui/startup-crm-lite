import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

/**
 * ThemeProvider component to wrap the application and supply
 * isDarkMode state and toggleTheme logic to all children.
 */
export function ThemeProvider({ children }) {
  // Initialize state from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true';
    } catch (e) {
      console.error('Failed to parse darkMode from localStorage:', e);
      return false;
    }
  });

  // Toggle theme action
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      try {
        localStorage.setItem('darkMode', String(nextMode));
      } catch (e) {
        console.error('Failed to set theme in localStorage:', e);
      }
      return nextMode;
    });
  };

  // Sync state with HTML element class
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to toggle dark class on documentElement:', e);
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the ThemeContext easily.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
