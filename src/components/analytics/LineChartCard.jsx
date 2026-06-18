// React for component creation
import React, { useMemo } from 'react';
// Recharts primitives for the conversion-rate line chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Lucide icon for the card header and empty state
import { TrendingUp } from 'lucide-react';
// Data transformation helper
import { getConversionByMonth } from '../../utils/analyticsHelpers';

/**
 * Custom tooltip showing the conversion rate plus the underlying won/total.
 * @param {{ active?: boolean, payload?: Array<Object>, label?: string }} props
 * @returns {JSX.Element | null}
 */
function ConversionTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <p className="text-sm font-semibold text-slate-100">{label}</p>
      <p className="mt-1 text-xs text-slate-400">
        <span className="font-bold text-emerald-400">{point.rate}%</span> conversion
      </p>
      <p className="text-xs text-slate-500">
        {point.won} won / {point.total} leads
      </p>
    </div>
  );
}

/**
 * LineChartCard — monthly conversion rate (Won / total leads) as a percentage
 * over the last six months.
 * @param {{ leads: Array<Object> }} props
 * @returns {JSX.Element}
 */
export default function LineChartCard({ leads = [] }) {
  const data = useMemo(() => getConversionByMonth(leads), [leads]);
  const hasData = data.some((d) => d.total > 0);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
      {/* Card header */}
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-400" />
        <h3 className="text-base font-bold text-white">Conversion Rate</h3>
      </div>

      {!hasData ? (
        // Empty state when no leads fall within the charted window
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <TrendingUp className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-500">Not enough data to chart conversion.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<ConversionTooltip />} cursor={{ stroke: '#22C55E', strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
