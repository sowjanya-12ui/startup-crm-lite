// Import React for JSX compilation and component creation
import React from 'react';
// Import Link from react-router-dom for the "View all" navigation shortcut
import { Link } from 'react-router-dom';
// Import Clock icon for the section header badge
import { Clock } from 'lucide-react';

/**
 * RecentLeads — Renders a clean table of the 5 most recently added leads.
 *
 * Each row displays the lead's name, company, a colour-coded status badge,
 * and the date the lead was added. The component adapts gracefully to
 * smaller screens by hiding lower-priority columns.
 *
 * @component
 * @param {Object}  props       - Component props.
 * @param {Array}   props.leads - Full leads array; only the last 5 entries are displayed.
 * @returns {JSX.Element}       The rendered RecentLeads table component.
 *
 * @example
 * <RecentLeads leads={sampleLeads} />
 */
export default function RecentLeads({ leads = [] }) {
  // Slice to get the 5 most recent leads (assumes newest are at the end)
  const recentFive = leads.slice(-5).reverse();

  /**
   * Returns a Tailwind class string for the status badge based on status value.
   * @param {string} status - Lead status key.
   * @returns {string} Tailwind class fragment for badge styling.
   */
  const getStatusClasses = (status) => {
    const map = {
      New:       'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-primary dark:border-blue-800/50',
      Contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50',
      Proposal:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
      Won:       'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
      Lost:      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50',
    };
    return map[status] || 'bg-surface text-text-secondary border-border-main   ';
  };

  return (
    // Card wrapper matching the dark glassmorphism dashboard theme
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm transition-colors duration-200">
      {/* Card header row */}
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <div>
          {/* Section title */}
          <h2 className="text-lg font-bold text-text-main">Recent Leads</h2>
          {/* Subtitle */}
          <p className="text-xs text-text-secondary">Newly captured contacts</p>
        </div>
        {/* Quick link to the full leads list */}
        <Link
          to="/leads"
          className="text-xs font-semibold text-primary dark:text-primary hover:text-primary dark:hover:text-blue-300 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Table container with horizontal scroll on small viewports */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[480px]">
          {/* Table header */}
          <thead>
            <tr className="border-b border-border-main">
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Name
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Company
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Status
              </th>
              <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Date Added
              </th>
            </tr>
          </thead>

          {/* Table body — iterate over the 5 most recent leads */}
          <tbody>
            {recentFive.map((lead, index) => (
              <tr
                key={lead.id ?? index}
                className="border-b border-border-main transition-colors duration-200 hover:bg-background dark:hover:bg-background"
              >
                {/* Lead name */}
                <td className="py-3.5 pr-4">
                  <span className="text-sm font-semibold text-text-main">{lead.name}</span>
                </td>
                {/* Company name */}
                <td className="py-3.5 pr-4">
                  <span className="text-sm text-text-secondary">{lead.company}</span>
                </td>
                {/* Status badge */}
                <td className="py-3.5 pr-4">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusClasses(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>
                {/* Date added */}
                <td className="py-3.5 text-right">
                  <span className="text-xs text-text-secondary">{lead.date}</span>
                </td>
              </tr>
            ))}

            {/* Empty state when no leads exist */}
            {recentFive.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-text-secondary">
                  No leads yet — add your first lead to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
