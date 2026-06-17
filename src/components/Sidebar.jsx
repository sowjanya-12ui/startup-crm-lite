// Import React and useState hook to manage drawer toggle state on mobile viewports
import React, { useState } from 'react';
// Import NavLink to build navigation links that automatically detect and style active states
import { NavLink } from 'react-router-dom';
// Import Lucide icons representing brand logo, sections, menu control, and status
import { LayoutDashboard, Users, BarChart3, Menu, X, Shield } from 'lucide-react';

// Define the Sidebar component definition
export default function Sidebar() {
  // Declare component state to track whether mobile side drawer is open or closed
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper method to retrieve tailwind classes for active/inactive links dynamically
  const getLinkClass = ({ isActive }) => {
    // Return base layout styles combined with conditional active/inactive colors and backgrounds
    return `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? 'bg-blue-600/10 text-blue-400 shadow-sm border border-blue-500/20 shadow-blue-500/5'
        : 'text-slate-400 border border-transparent hover:bg-slate-900/60 hover:text-slate-200'
    }`;
  };

  // Render navigation links list to keep the template clean and modular
  const renderNavLinks = (closeDrawer = false) => (
    // Group links vertically in a column structure
    <nav className="flex flex-col gap-1.5">
      
      {/* Route link pointing to Dashboard */}
      <NavLink 
        to="/" 
        // Trigger drawer close on mobile if callback matches
        onClick={() => closeDrawer && setIsMobileOpen(false)}
        className={getLinkClass}
      >
        {/* Dashboard Icon */}
        <LayoutDashboard className="h-5 w-5" />
        <span>Dashboard</span>
      </NavLink>

      {/* Route link pointing to Lead Management */}
      <NavLink 
        to="/leads" 
        // Trigger drawer close on mobile if callback matches
        onClick={() => closeDrawer && setIsMobileOpen(false)}
        className={getLinkClass}
      >
        {/* Users Icon */}
        <Users className="h-5 w-5" />
        <span>Leads</span>
      </NavLink>

      {/* Route link pointing to Analytics dashboard */}
      <NavLink 
        to="/analytics" 
        // Trigger drawer close on mobile if callback matches
        onClick={() => closeDrawer && setIsMobileOpen(false)}
        className={getLinkClass}
      >
        {/* Chart Icon */}
        <BarChart3 className="h-5 w-5" />
        <span>Analytics</span>
      </NavLink>

    </nav>
  );

  return (
    // React fragment containing desktop and mobile components wrappers
    <>
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR VIEWPORT (visible from md scale and above) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-slate-900 bg-slate-900/30 p-6 backdrop-blur-sm sticky top-0">
        
        {/* Top elements section containing logo and menu navigation links */}
        <div className="flex flex-col">
          
          {/* Logo brand container linking to dashboard */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 group transition-transform duration-300 mb-8 px-2"
          >
            {/* Logo image shield wrapper */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Shield className="h-5.5 w-5.5" />
            </div>
            {/* Title display */}
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Startup CRM
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Lite Edition
              </span>
            </div>
          </NavLink>

          {/* Navigation Links list render */}
          {renderNavLinks(false)}

        </div>

        {/* Bottom elements section containing live status pill */}
        <div className="border-t border-slate-800/80 pt-4 px-2">
          {/* Green system status badge block */}
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2.5 text-xs font-bold text-emerald-400">
            {/* Pulsing indicator bullet */}
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live System</span>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MOBILE HEADER VIEWPORT (visible below md scale) */}
      {/* ========================================================================= */}
      <header className="flex md:hidden h-16 w-full items-center justify-between border-b border-slate-900 bg-slate-950/80 px-4 backdrop-blur-md sticky top-0 z-40">
        
        {/* Mobile Header brand logo links back to dashboard */}
        <NavLink to="/" className="flex items-center gap-2.5">
          {/* Brand logo container */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
            <Shield className="h-4.5 w-4.5" />
          </div>
          {/* Brand title */}
          <span className="text-sm font-extrabold tracking-tight text-white">
            Startup CRM
          </span>
        </NavLink>

        {/* Hamburger Menu Toggle icon button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
          aria-label="Open Sidebar Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

      </header>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER DRAWER OVERLAY (visible when isMobileOpen is toggled true) */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        // Wrapper grouping backdrop overlay and navigation side drawer
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          
          {/* Semi-translucent dark backdrop click shield to close drawer */}
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs"
          ></div>

          {/* Slide-out drawer element container */}
          <aside className="relative flex h-full w-64 flex-col justify-between border-r border-slate-900 bg-slate-950 p-6 shadow-2xl animate-in slide-in-from-left duration-250">
            
            <div className="flex flex-col">
              
              {/* Top drawer header containing logo and close button */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    Startup CRM
                  </span>
                </div>
                {/* Close trigger button */}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  aria-label="Close Sidebar Navigation"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Navigation links passing true to trigger drawer close onClick */}
              {renderNavLinks(true)}

            </div>

            {/* Bottom Drawer elements containing status pill */}
            <div className="border-t border-slate-900 pt-4">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 py-2 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live System</span>
              </div>
            </div>

          </aside>

        </div>
      )}

    </>
  );
}
