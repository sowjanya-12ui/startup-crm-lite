// Import React and standard helpers for lazy loading and Suspense fallback container
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom to define application paths
import { Routes, Route } from 'react-router-dom';

// Lazy load the Dashboard page component for code-splitting and performance optimization
const Dashboard = lazy(() => import('../pages/Dashboard'));
// Lazy load the LeadManagement page component for code-splitting and performance optimization
const LeadManagement = lazy(() => import('../pages/LeadManagement'));
// Lazy load the Analytics page component for code-splitting and performance optimization
const Analytics = lazy(() => import('../pages/Analytics'));
// Lazy load the NotFound page component for code-splitting and performance optimization
const NotFound = lazy(() => import('../pages/NotFound'));

// Inline Loader component rendering a premium CSS loading spinner matching the theme
function RouteLoader() {
  return (
    // Centered loading viewport wrapper
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4">
        {/* Animated glowing double ring spinner */}
        <div className="relative h-12 w-12">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          {/* Rotating outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        {/* Loading text with pulse effect */}
        <span className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse">
          Loading Workspace...
        </span>
      </div>
    </div>
  );
}

// Define the primary AppRoutes router mapping component
export default function AppRoutes() {
  return (
    // Wrap the routes within Suspense to handle chunks loading state gracefully
    <Suspense fallback={<RouteLoader />}>
      {/* Route matching container */}
      <Routes>
        
        {/* Route mapping for primary Dashboard workspace */}
        <Route path="/" element={<Dashboard />} />

        {/* Route mapping for CRM Lead Management module */}
        <Route path="/leads" element={<LeadManagement />} />

        {/* Route mapping for Sales Analytics page */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Catch-all route mapping to capture undefined paths and render the 404 page */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
