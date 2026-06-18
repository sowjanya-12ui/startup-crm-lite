// Import React for JSX compilation and component creation
import React from 'react';

/**
 * Status-to-style mapping for all supported CRM lead statuses.
 * Each key maps to Tailwind classes for background, text, and border colours.
 * @type {Record<string, string>}
 */
const STATUS_STYLES = {
  'New':               'bg-slate-100    text-slate-600    border-slate-200    dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700/50',
  'Contacted':         'bg-blue-50      text-blue-700     border-blue-200     dark:bg-blue-950/40   dark:text-blue-400  dark:border-blue-800/50',
  'Meeting':           'bg-indigo-50    text-indigo-700   border-indigo-200   dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50',
  'Meeting Scheduled': 'bg-indigo-50    text-indigo-700   border-indigo-200   dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50',
  'Proposal':          'bg-amber-50     text-amber-700    border-amber-200    dark:bg-amber-950/40  dark:text-amber-400  dark:border-amber-800/50',
  'Proposal Sent':     'bg-amber-50     text-amber-700    border-amber-200    dark:bg-amber-950/40  dark:text-amber-400  dark:border-amber-800/50',
  'Won':               'bg-emerald-50   text-emerald-700  border-emerald-200  dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
  'Lost':              'bg-red-50       text-red-700      border-red-200      dark:bg-red-950/40   dark:text-red-400   dark:border-red-800/50',
};

/** Fallback style when status is unknown */
const FALLBACK_STYLE = 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';

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
