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
      New:       'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Contacted: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      Proposal:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Won:       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Lost:      'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return map[status] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    // Card wrapper matching the dark glassmorphism dashboard theme
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
      {/* Card header row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          {/* Section title */}
          <h2 className="text-lg font-bold text-white">Recent Leads</h2>
          {/* Subtitle */}
          <p className="text-xs text-slate-400">Newly captured contacts</p>
        </div>
        {/* Quick link to the full leads list */}
        <Link
          to="/leads"
          className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Table container with horizontal scroll on small viewports */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[480px]">
          {/* Table header */}
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Company
              </th>
              <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Date Added
              </th>
            </tr>
          </thead>

          {/* Table body — iterate over the 5 most recent leads */}
          <tbody>
            {recentFive.map((lead, index) => (
              <tr
                key={lead.id ?? index}
                className="border-b border-slate-800/30 transition-colors duration-200 hover:bg-slate-900/60"
              >
                {/* Lead name */}
                <td className="py-3.5 pr-4">
                  <span className="text-sm font-semibold text-white">{lead.name}</span>
                </td>
                {/* Company name */}
                <td className="py-3.5 pr-4">
                  <span className="text-sm text-slate-400">{lead.company}</span>
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
                  <span className="text-xs text-slate-500">{lead.date}</span>
                </td>
              </tr>
            ))}

            {/* Empty state when no leads exist */}
            {recentFive.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
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
