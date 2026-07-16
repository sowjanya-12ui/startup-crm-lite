import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/** Custom tooltip */
const BarTooltip = ({ active, payload, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-border-main bg-surface px-4 py-3 shadow-xl text-sm transition-colors duration-200">
      <p className="font-semibold text-text-secondary text-xs uppercase tracking-wide mb-1">{d.month}</p>
      <p className="font-extrabold text-text-main">
        {d.count} <span className="font-normal text-text-secondary">Leads</span>
      </p>
    </div>
  );
};

/**
 * BarChartCard
 *
 * Monthly lead counts bar chart for the last 6 months.
 *
 * @param {{ monthlyLeads: Array<{month:string, count:number}> }} props
 */
const BarChartCard = memo(function BarChartCard({ monthlyLeads = [] }) {
  const { isDarkMode } = useTheme();

  if (!monthlyLeads.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-border-main bg-surface shadow-sm transition-colors duration-200">
        <p className="text-sm text-text-secondary dark:text-text-secondary">No monthly data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-text-main">Monthly Leads Trend</h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary mt-0.5">Lead generation · last 6 months</p>
      </div>

      {/* Chart */}
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyLeads} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f3f4f6'} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<BarTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? '#1f2937' : '#eff6ff', radius: 8 }} />
            <Bar
              dataKey="count"
              fill={isDarkMode ? '#3b82f6' : '#2563EB'}
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
              animationBegin={0}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default BarChartCard;
