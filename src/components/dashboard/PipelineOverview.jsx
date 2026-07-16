// Import React for JSX compilation and component creation
import React from 'react';
// Import GitBranch icon to visually represent the pipeline funnel
import { GitBranch } from 'lucide-react';

/**
 * PipelineOverview — Displays a horizontal stacked bar visualising
 * the distribution of leads across each pipeline status.
 *
 * Each coloured segment is proportional to the number of leads in
 * that status. A legend is rendered below the bar with counts and
 * colour indicators.
 *
 * @component
 * @param {Object}   props       - Component props.
 * @param {Array}    props.leads - Array of lead objects, each with a `status` string field.
 * @returns {JSX.Element}        The rendered PipelineOverview component.
 *
 * @example
 * <PipelineOverview leads={[{ status: 'New' }, { status: 'Contacted' }]} />
 */
export default function PipelineOverview({ leads = [] }) {
  // Define the ordered pipeline stages with display labels and matching Tailwind colour classes
  const stages = [
    { key: 'New',       label: 'New',       barColor: 'bg-primary',    dotColor: 'bg-primary',    textColor: 'text-primary dark:text-primary' },
    { key: 'Contacted', label: 'Contacted',  barColor: 'bg-indigo-500',  dotColor: 'bg-indigo-500',  textColor: 'text-indigo-600 dark:text-indigo-400' },
    { key: 'Proposal',  label: 'Proposal',   barColor: 'bg-amber-500',   dotColor: 'bg-amber-500',   textColor: 'text-amber-600 dark:text-amber-400' },
    { key: 'Won',       label: 'Won',        barColor: 'bg-emerald-500', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'Lost',      label: 'Lost',       barColor: 'bg-red-500',     dotColor: 'bg-red-500',     textColor: 'text-red-600 dark:text-red-400' },
  ];

  // Total number of leads for percentage calculation
  const total = leads.length;

  // Pre-compute count per stage to avoid repeated iterations
  const countByStage = stages.map((stage) => ({
    ...stage,
    count: leads.filter((lead) => lead.status === stage.key).length,
  }));

  return (
    // Card wrapper matching the dark glassmorphism theme used across the dashboard
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm transition-colors duration-200">
      {/* Card header row */}
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <div>
          {/* Section title */}
          <h2 className="text-lg font-bold text-text-main">Pipeline Overview</h2>
          {/* Subtitle */}
          <p className="text-xs text-text-secondary">Current lead distribution by status</p>
        </div>
        {/* Decorative badge */}
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-primary">
          <GitBranch className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span>{total} Total</span>
        </div>
      </div>

      {/* Horizontal stacked bar */}
      <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-surface">
        {countByStage.map(
          (stage) =>
            // Only render visible segments (count > 0)
            stage.count > 0 && (
              <div
                key={stage.key}
                className={`${stage.barColor} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${(stage.count / total) * 100}%` }}
                title={`${stage.label}: ${stage.count}`}
              />
            )
        )}
      </div>

      {/* Legend row with counts */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {countByStage.map((stage) => (
          <div key={stage.key} className="flex items-center gap-2 rounded-lg border border-border-main bg-background/50 /50 px-3 py-2">
            {/* Colour dot indicator */}
            <span className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
            <div className="flex flex-col">
              {/* Stage label */}
              <span className="text-[11px] font-medium text-text-secondary">{stage.label}</span>
              {/* Count and percentage */}
              <span className={`text-sm font-bold ${stage.textColor}`}>
                {stage.count}
                {total > 0 && (
                  <span className="ml-1 text-[10px] font-normal text-text-secondary dark:text-text-secondary">
                    ({Math.round((stage.count / total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
