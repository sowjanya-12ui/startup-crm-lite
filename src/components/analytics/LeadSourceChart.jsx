import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const SOURCE_COLORS = {
  Website:        '#2563EB',
  Referral:       '#22C55E',
  LinkedIn:       '#0A66C2',
  'Cold Call':    '#F59E0B',
  'Cold Email':   '#F97316',
  'Email Campaign': '#7C3AED',
  Instagram:      '#E1306C',
  Ads:            '#EF4444',
  Other:          '#6B7280',
};

const SourceTooltip = ({ active, payload, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-xl text-sm transition-colors duration-200">
      <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">{d.source}</p>
      <p className="font-extrabold text-gray-900 dark:text-white">{d.count} <span className="font-normal text-gray-500 dark:text-gray-400">Leads</span></p>
    </div>
  );
};

/**
 * LeadSourceChart — Horizontal bar chart of leads by acquisition source.
 * @param {{ leadSourceStats: Array<{source:string, count:number}> }} props
 */
const LeadSourceChart = memo(function LeadSourceChart({ leadSourceStats = [] }) {
  const { isDarkMode } = useTheme();

  if (!leadSourceStats.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <p className="text-sm text-gray-400 dark:text-gray-500">No source data yet</p>
      </div>
    );
  }

  const sorted = [...leadSourceStats].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Lead Sources</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Acquisition channel breakdown</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sorted}
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="source"
              width={96}
              tick={{ fill: isDarkMode ? '#d1d5db' : '#6b7280', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<SourceTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? '#1f2937' : '#f9fafb' }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24} animationBegin={0} animationDuration={800}>
              {sorted.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={SOURCE_COLORS[entry.source] ?? '#6366F1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default LeadSourceChart;
