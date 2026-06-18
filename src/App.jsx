// Import React to enable component building and JSX syntax support
import React from 'react';
// Import BrowserRouter wrapper from react-router-dom to supply routing context to child components
import { BrowserRouter } from 'react-router-dom';
// Import the Toaster component from react-hot-toast for global toast notification rendering
import { Toaster } from 'react-hot-toast';
// Import the responsive Sidebar navigation component
import Sidebar from './components/Sidebar';
// Import the routes mapping definitions component
import AppRoutes from './routes';
// Import the global LeadProvider context for analytics data
import { LeadProvider } from './context/LeadContext';
import { useTheme } from './context/ThemeContext';

// Define the root App component function
function App() {
  const { isDarkMode } = useTheme();

  return (
    // Wrap entire DOM tree inside BrowserRouter to activate client-side routing logic
    <BrowserRouter>
      <LeadProvider>
      {/* Outer wrapper to maintain full-screen background colors across themes */}
      <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-200">
        {/* Primary styling wrapper setting a responsive flex layout: stack on mobile, row on desktop. Fluid on all screens. */}
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
          
          {/* Render vertical responsive Sidebar navigation on the left */}
          <Sidebar />

          {/* Content main workspace containing our lazy-loaded page route views on the right */}
          <main className="flex-1 relative z-10 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Inject route switcher matching path URL patterns */}
            <AppRoutes />
          </main>

        </div>
      </div>

      {/* Global toast notification provider — positioned top-right, dynamically styled for theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#111827',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      </LeadProvider>
    </BrowserRouter>
  );
}

// Export App component as default export for main.jsx entry mount execution
export default App;