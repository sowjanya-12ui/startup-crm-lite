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

// Define the root App component function
function App() {
  return (
    // Wrap entire DOM tree inside BrowserRouter to activate client-side routing logic
    <BrowserRouter>
      {/* Primary styling wrapper setting a responsive flex layout: stack on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
        
        {/* Render vertical responsive Sidebar navigation on the left */}
        <Sidebar />

        {/* Content main workspace containing our lazy-loaded page route views on the right */}
        <main className="flex-1 relative z-10 overflow-y-auto">
          {/* Inject route switcher matching path URL patterns */}
          <AppRoutes />
        </main>

      </div>

      {/* Global toast notification provider — positioned top-right, dark themed */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </BrowserRouter>
  );
}

// Export App component as default export for main.jsx entry mount execution
export default App;