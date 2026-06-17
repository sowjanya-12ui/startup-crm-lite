// Import React for JSX compilation and component creation
import React from 'react';
// Import action icons from lucide-react for edit and delete buttons
import { Pencil, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
// Import the reusable StatusBadge component
import StatusBadge from './StatusBadge';

/**
 * LeadCard — Displays a single lead's information in a vertical card layout
 * optimised for mobile viewports and grid arrangements.
 *
 * Shows the lead's name, company, email, phone, and pipeline status badge,
 * along with Edit (pencil) and Delete (trash) action buttons.
 *
 * @component
 * @param {Object}   props          - Component props.
 * @param {Object}   props.lead     - The lead data object to render.
 * @param {string}   props.lead.name    - Contact full name.
 * @param {string}   props.lead.company - Company name.
 * @param {string}   props.lead.email   - Email address.
 * @param {string}   [props.lead.phone] - Phone number (optional).
 * @param {string}   props.lead.status  - Pipeline status string.
 * @param {Function} props.onEdit   - Callback invoked with the lead when Edit is clicked.
 * @param {Function} props.onDelete - Callback invoked with the lead id when Delete is clicked.
 * @returns {JSX.Element}           The rendered LeadCard component.
 *
 * @example
 * <LeadCard lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  return (
    // Card container with dark glassmorphism styling and subtle hover elevation
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-700/80 hover:bg-slate-900/80">

      {/* Top section: name, status badge, and action buttons */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Lead name */}
          <h3 className="truncate text-base font-bold text-white">{lead.name}</h3>
          {/* Company with icon */}
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <span className="truncate">{lead.company}</span>
          </div>
        </div>
        {/* Status badge */}
        <StatusBadge status={lead.status} />
      </div>

      {/* Contact details */}
      <div className="mt-4 space-y-2">
        {/* Email row */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          <span className="truncate">{lead.email}</span>
        </div>
        {/* Phone row (rendered only when phone data exists) */}
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Action buttons row — Edit and Delete */}
      <div className="mt-4 flex items-center gap-2 border-t border-slate-800/60 pt-3.5">
        {/* Edit button */}
        <button
          type="button"
          onClick={() => onEdit(lead)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
          aria-label={`Edit lead ${lead.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(lead.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          aria-label={`Delete lead ${lead.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
