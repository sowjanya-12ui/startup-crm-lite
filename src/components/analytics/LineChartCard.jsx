import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const LineTooltip = ({ active, payload, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-xl text-sm transition-colors duration-200">
      <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">{d.month}</p>
      <p className="font-extrabold text-gray-900 dark:text-white">
        {d.conversion}% <span className="font-normal text-gray-500 dark:text-gray-400">Conversion</span>
      </p>
    </div>
  );
};

/**
 * LineChartCard — Monthly conversion rate (Won / Total) trend.
 * @param {{ conversionByMonth: Array<{month:string, conversion:number}> }} props
 */
const LineChartCard = memo(function LineChartCard({ conversionByMonth = [] }) {
  const { isDarkMode } = useTheme();

  if (!conversionByMonth.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <p className="text-sm text-gray-400 dark:text-gray-500">No conversion data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Conversion Rate Trend</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Won / Total leads · last 6 months</p>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={conversionByMonth} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f3f4f6'} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ReferenceLine y={20} stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} strokeDasharray="4 4" label={{ value: 'Target', fill: isDarkMode ? '#9ca3af' : '#d1d5db', fontSize: 10, position: 'right' }} />
            <Tooltip content={<LineTooltip isDarkMode={isDarkMode} />} />
            <Line
              type="monotone"
              dataKey="conversion"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ fill: isDarkMode ? '#1f2937' : '#fff', stroke: '#22C55E', strokeWidth: 2.5, r: 4 }}
              activeDot={{ fill: '#22C55E', stroke: isDarkMode ? '#1f2937' : '#fff', strokeWidth: 2, r: 6 }}
              animationBegin={0}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default LineChartCard;
