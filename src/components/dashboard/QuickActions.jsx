// Import React for JSX compilation and component creation
import React from 'react';
// Import Link from react-router-dom for client-side navigation
import { Link } from 'react-router-dom';
// Import action-related icons from lucide-react
import { Plus, Eye, Download } from 'lucide-react';

/**
 * QuickActions — Renders a set of prominent action buttons for the
 * most common CRM workflows: adding a lead, viewing all leads, and
 * exporting data.
 *
 * Each button is styled with a unique colour scheme and links to the
 * appropriate route (or triggers a browser download for export).
 *
 * @component
 * @returns {JSX.Element} The rendered QuickActions button group.
 *
 * @example
 * <QuickActions />
 */
export default function QuickActions() {
  /**
   * Handler for the Export Data button.
   * In the current phase this is a placeholder — real export logic will
   * be wired in Phase 8 when the backend API is integrated.
   */
  const handleExport = () => {
    // Placeholder: log a message until real export is implemented
    alert('Export feature will be available once the backend API is connected (Phase 8).');
  };

  return (
    // Card wrapper matching the dark glassmorphism dashboard theme
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm transition-colors duration-200">
      {/* Card header */}
      <div className="border-b border-border-main pb-4">
        <h2 className="text-lg font-bold text-text-main">Quick Actions</h2>
        <p className="text-xs text-text-secondary">Frequently used shortcuts</p>
      </div>

      {/* Action buttons grid — stacks on mobile, row on sm+ */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Add New Lead button */}
        <Link
          to="/leads"
          id="quick-action-add-lead"
          className="flex items-center justify-center gap-2.5 rounded-xl border border-primary/20 bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-primary hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Lead</span>
        </Link>

        {/* View All Leads button */}
        <Link
          to="/leads"
          id="quick-action-view-leads"
          className="flex items-center justify-center gap-2.5 rounded-xl border border-border-main bg-background text-text-secondary transition-all duration-300 hover:bg-surface dark:hover:bg-surface hover:border-border-main hover:-translate-y-0.5 active:translate-y-0"
        >
          <Eye className="h-4.5 w-4.5" />
          <span>View All Leads</span>
        </Link>

        {/* Export Data button */}
        <button
          type="button"
          onClick={handleExport}
          id="quick-action-export"
          className="flex items-center justify-center gap-2.5 rounded-xl border border-border-main bg-background text-text-secondary transition-all duration-300 hover:bg-surface dark:hover:bg-surface hover:border-border-main hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Download className="h-4.5 w-4.5" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
}
