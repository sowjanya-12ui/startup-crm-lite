// Import React for JSX compilation and component creation
import React from 'react';
// Import action icons from lucide-react for inline row operations
import { Pencil, Trash2, Mail, Briefcase, User } from 'lucide-react';
// Import the reusable StatusBadge component for status column rendering
import StatusBadge from './StatusBadge';

/**
 * LeadTable — Renders all leads in a full-width desktop data table.
 *
 * Columns displayed: Name (with email), Company, Status, Email, Source,
 * Date Added, and Actions (edit + delete). The table is horizontally
 * scrollable on smaller viewports for graceful degradation.
 *
 * @component
 * @param {Object}   props          - Component props.
 * @param {Array}    props.leads    - Array of lead data objects to render as rows.
 * @param {Function} props.onEdit   - Callback invoked with the lead object when Edit is clicked.
 * @param {Function} props.onDelete - Callback invoked with lead.id when Delete is clicked.
 * @returns {JSX.Element}           The rendered LeadTable component.
 *
 * @example
 * <LeadTable leads={filteredLeads} onEdit={handleEdit} onDelete={handleDelete} />
 */
export default function LeadTable({ leads = [], onEdit, onDelete }) {
  return (
    // Outer container with dark card styling and overflow handling
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
      {/* Horizontal scroll wrapper for narrow viewports */}
      <div className="overflow-x-auto">
        {/* Data table */}
        <table className="min-w-full divide-y divide-slate-800/80 text-left text-sm">

          {/* Column headers */}
          <thead className="bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4">Lead Contact</th>
              <th scope="col" className="px-6 py-4">Company</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Source</th>
              <th scope="col" className="px-6 py-4">Date Added</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="divide-y divide-slate-800/40">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="group transition-colors duration-200 hover:bg-slate-900/40"
                >
                  {/* Name cell — with avatar placeholder */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar circle */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-semibold text-white">{lead.name}</span>
                    </div>
                  </td>

                  {/* Company cell */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-slate-600" />
                      <span>{lead.company}</span>
                    </div>
                  </td>

                  {/* Status badge cell */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email cell */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-slate-600" />
                      <span>{lead.email}</span>
                    </div>
                  </td>

                  {/* Source cell */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                    {lead.source || '—'}
                  </td>

                  {/* Date cell */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                    {lead.date}
                  </td>

                  {/* Actions cell */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-400"
                        aria-label={`Edit lead ${lead.name}`}
                        title="Edit Lead"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => onDelete(lead.id)}
                        className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Delete lead ${lead.name}`}
                        title="Delete Lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty state row
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-500">
                  No leads found matching your criteria. Try adjusting your filters or add a new lead!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
