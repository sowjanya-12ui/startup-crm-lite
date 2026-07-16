// Import React to enable JSX syntax and component definition
import React from 'react';
// Import Link component to navigate users back to safe routes without full page refresh
import { Link } from 'react-router-dom';
// Import icons from lucide-react to render graphical error details
import { Home, Compass, AlertTriangle } from 'lucide-react';

// Main NotFound page component function definition
export default function NotFound() {
  return (
    // Outer layout container taking full viewport height with flexbox alignment
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-center text-text-main sm:px-6 lg:px-8">
      
      {/* Decorative soft gradient blobs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/60 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 translate-x-1/2 rounded-full bg-indigo-100/60 blur-[100px] pointer-events-none"></div>

      {/* Main content card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border-main bg-surface p-8 shadow-lg">
        
        {/* Error icon header section */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 animate-bounce">
          {/* AlertTriangle icon indicating resource is not available */}
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Big error code title */}
        <h1 className="mt-6 text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
          404
        </h1>
        <h2 className="mt-3 text-xl font-bold text-text-main">
          Page Not Found
        </h2>
        {/* Helper explanation text */}
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* Navigations buttons group */}
        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
          
          {/* Main button to return back to home dashboard page */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-primary hover:shadow-blue-500/35 transition-all duration-300"
          >
            {/* Home Icon */}
            <Home className="h-4.5 w-4.5" />
            <span>Go to Dashboard</span>
          </Link>

          {/* Secondary support or helpful link */}
          <Link
            to="/leads"
            className="flex items-center justify-center gap-2 rounded-xl border border-border-main bg-background px-5 py-3 text-sm font-semibold text-text-secondary hover:bg-surface hover:text-text-main transition-all duration-300"
          >
            {/* Compass Icon */}
            <Compass className="h-4.5 w-4.5" />
            <span>View CRM Leads</span>
          </Link>

        </div>

      </div>

    </div>
  );
}
