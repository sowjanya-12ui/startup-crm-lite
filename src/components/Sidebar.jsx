// Import React and useState hook to manage drawer toggle state on mobile viewports
import React, { useState } from 'react';
// Import NavLink to build navigation links that automatically detect and style active states
import { NavLink } from 'react-router-dom';
// Import Lucide icons representing brand logo, sections, menu control, and status
import { LayoutDashboard, Users, BarChart3, Menu, X, Shield, LogOut } from 'lucide-react';
// Import the custom theme toggle switch
import DarkModeToggle from './common/DarkModeToggle';
import { useAuth } from '../context/AuthContext';

// Define the Sidebar component definition
export default function Sidebar() {
  // Declare component state to track whether mobile side drawer is open or closed
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();

  // Helper method to retrieve tailwind classes for active/inactive links dynamically
  const getLinkClass = ({ isActive }) => {
    // Return base layout styles combined with conditional active/inactive colors and backgrounds
    return `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/30'
        : 'text-gray-500 dark:text-gray-400 border border-transparent hover:bg-gray-50 dark:hover:bg-gray-900/40 hover:text-gray-900 dark:hover:text-white'
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
      <aside className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sticky top-0 transition-colors duration-200">
        
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
              <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Startup CRM
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Lite Edition
              </span>
            </div>
          </NavLink>

          {/* Navigation Links list render */}
          {renderNavLinks(false)}

        </div>

        {/* Bottom elements section containing live status pill & dark mode toggle */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 px-2 space-y-4 transition-colors duration-200">
          {/* Dark Mode Toggle */}
          <div className="flex justify-start px-2">
            <DarkModeToggle />
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>

          {/* Green system status badge block */}
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/5 py-2.5 text-xs font-bold text-emerald-400 transition-colors duration-200">
            {/* Pulsing indicator bullet */}
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live System</span>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MOBILE HEADER VIEWPORT (visible below md scale) */}
      {/* ========================================================================= */}
      <header className="flex md:hidden h-16 w-full items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sticky top-0 z-40 transition-colors duration-200">
        
        {/* Mobile Header brand logo links back to dashboard */}
        <NavLink to="/" className="flex items-center gap-2.5">
          {/* Brand logo container */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
            <Shield className="h-4.5 w-4.5" />
          </div>
          {/* Brand title */}
          <span className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white">
            Startup CRM
          </span>
        </NavLink>

        {/* Right side controls: theme toggle & menu button */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />

          {/* Hamburger Menu Toggle icon button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Open Sidebar Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

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
            className="fixed inset-0 bg-gray-900/40 dark:bg-gray-950/60 backdrop-blur-xs"
          ></div>

          {/* Slide-out drawer element container */}
          <aside className="relative flex h-full w-64 flex-col justify-between border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-2xl animate-in slide-in-from-left duration-250 transition-colors duration-200">
            
            <div className="flex flex-col">
              
              {/* Top drawer header containing logo and close button */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Startup CRM
                  </span>
                </div>
                {/* Close trigger button */}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Close Sidebar Navigation"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Navigation links passing true to trigger drawer close onClick */}
              {renderNavLinks(true)}

            </div>

            {/* Bottom Drawer elements containing status pill */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 px-2 space-y-4 transition-colors duration-200">
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>

              <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/5 py-2 text-xs font-semibold text-emerald-400">
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
