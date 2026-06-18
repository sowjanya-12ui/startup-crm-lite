// React for component creation
import React, { useMemo } from 'react';
// Recharts primitives for the pie/donut visualization
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// Lucide icon for the card header and empty state
import { PieChart as PieChartIcon } from 'lucide-react';
// Data transformation helper
import { getStatusDistribution } from '../../utils/analyticsHelpers';

/**
 * Custom tooltip rendering the exact count and percentage for a status slice.
 * @param {{ active?: boolean, payload?: Array<Object> }} props
 * @returns {JSX.Element | null}
 */
function StatusTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
        <span className="text-sm font-semibold text-slate-100">{slice.name}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        <span className="font-bold text-slate-200">{slice.value}</span> leads
        {' · '}
        <span className="font-bold text-slate-200">{slice.percentage}%</span>
      </p>
    </div>
  );
}

/**
 * PieChartCard — donut chart of lead distribution across pipeline statuses,
 * with a custom legend showing each status name, count, and percentage.
 * @param {{ leads: Array<Object> }} props
 * @returns {JSX.Element}
 */
export default function PieChartCard({ leads = [] }) {
  const data = useMemo(() => getStatusDistribution(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
      {/* Card header */}
      <div className="mb-4 flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-blue-400" />
        <h3 className="text-base font-bold text-white">Lead Status Distribution</h3>
      </div>

      {data.length === 0 ? (
        // Empty state when there are no leads to chart
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <PieChartIcon className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-500">No leads to display yet.</p>
        </div>
      ) : (
        <>
          {/* Responsive donut chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend: status name, count, percentage */}
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="text-slate-400">
                  <span className="font-semibold text-slate-200">{entry.value}</span>
                  {' '}({entry.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
