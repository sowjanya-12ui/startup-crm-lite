// React for component creation
import React, { useMemo } from 'react';
// Recharts primitives for the monthly bar chart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Lucide icon for the card header and empty state
import { BarChart3 } from 'lucide-react';
// Data transformation helper
import { getMonthlyLeads } from '../../utils/analyticsHelpers';

/**
 * Custom tooltip showing the exact lead count for a month.
 * @param {{ active?: boolean, payload?: Array<Object>, label?: string }} props
 * @returns {JSX.Element | null}
 */
function MonthlyTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <p className="text-sm font-semibold text-slate-100">{label}</p>
      <p className="mt-1 text-xs text-slate-400">
        <span className="font-bold text-blue-400">{payload[0].value}</span> leads
      </p>
    </div>
  );
}

/**
 * BarChartCard — number of leads created per month over the last six months.
 * @param {{ leads: Array<Object> }} props
 * @returns {JSX.Element}
 */
export default function BarChartCard({ leads = [] }) {
  const data = useMemo(() => getMonthlyLeads(leads), [leads]);
  const hasData = data.some((d) => d.leads > 0);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
      {/* Card header */}
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-400" />
        <h3 className="text-base font-bold text-white">Monthly Leads</h3>
      </div>

      {!hasData ? (
        // Empty state when no leads fall within the charted window
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <BarChart3 className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-500">No leads in the last 6 months.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<MonthlyTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }} />
              <Bar dataKey="leads" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
