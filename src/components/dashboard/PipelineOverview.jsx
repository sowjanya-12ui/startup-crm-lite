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
    { key: 'New',       label: 'New',       barColor: 'bg-blue-500',    dotColor: 'bg-blue-500',    textColor: 'text-blue-400' },
    { key: 'Contacted', label: 'Contacted',  barColor: 'bg-indigo-500',  dotColor: 'bg-indigo-500',  textColor: 'text-indigo-400' },
    { key: 'Proposal',  label: 'Proposal',   barColor: 'bg-amber-500',   dotColor: 'bg-amber-500',   textColor: 'text-amber-400' },
    { key: 'Won',       label: 'Won',        barColor: 'bg-emerald-500', dotColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { key: 'Lost',      label: 'Lost',       barColor: 'bg-red-500',     dotColor: 'bg-red-500',     textColor: 'text-red-400' },
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
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
      {/* Card header row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          {/* Section title */}
          <h2 className="text-lg font-bold text-white">Pipeline Overview</h2>
          {/* Subtitle */}
          <p className="text-xs text-slate-400">Current lead distribution by status</p>
        </div>
        {/* Decorative badge */}
        <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300">
          <GitBranch className="h-3.5 w-3.5 text-blue-500" />
          <span>{total} Total</span>
        </div>
      </div>

      {/* Horizontal stacked bar */}
      <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-slate-800">
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
          <div key={stage.key} className="flex items-center gap-2 rounded-lg border border-slate-800/60 bg-slate-900/40 px-3 py-2">
            {/* Colour dot indicator */}
            <span className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
            <div className="flex flex-col">
              {/* Stage label */}
              <span className="text-[11px] font-medium text-slate-400">{stage.label}</span>
              {/* Count and percentage */}
              <span className={`text-sm font-bold ${stage.textColor}`}>
                {stage.count}
                {total > 0 && (
                  <span className="ml-1 text-[10px] font-normal text-slate-500">
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
