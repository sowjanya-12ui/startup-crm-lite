// Import React for JSX compilation and component creation
import React from 'react';

/**
 * Status-to-style mapping for all supported CRM lead statuses.
 * Each key maps to Tailwind classes for background, text, and border colours.
 * @type {Record<string, string>}
 */
const STATUS_STYLES = {
  'New':               'bg-slate-500/10  text-slate-300    border-slate-500/20',
  'Contacted':         'bg-blue-500/10   text-blue-400     border-blue-500/20',
  'Meeting Scheduled': 'bg-indigo-500/10 text-indigo-400   border-indigo-500/20',
  'Proposal Sent':     'bg-amber-500/10  text-amber-400    border-amber-500/20',
  'Won':               'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Lost':              'bg-red-500/10    text-red-400      border-red-500/20',
};

/** Fallback style when status is unknown */
const FALLBACK_STYLE = 'bg-slate-800 text-slate-400 border-slate-700/50';

/**
 * StatusBadge — Renders a pill-shaped, colour-coded badge for a lead's
 * current pipeline status.
 *
 * Each status (New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost)
 * receives a unique colour scheme. Unknown statuses fall back to a neutral
 * slate treatment.
 *
 * @component
 * @param {Object}  props        - Component props.
 * @param {string}  props.status - The lead status string to display.
 * @param {string}  [props.className] - Optional extra classes to merge.
 * @returns {JSX.Element}        The rendered StatusBadge pill element.
 *
 * @example
 * <StatusBadge status="Won" />
 * <StatusBadge status="Lost" className="text-xs" />
 */
export default function StatusBadge({ status, className = '' }) {
  // Resolve the colour scheme or use neutral fallback
  const colorClasses = STATUS_STYLES[status] || FALLBACK_STYLE;

  return (
    // Pill badge element with colour-coded border and background
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
}
