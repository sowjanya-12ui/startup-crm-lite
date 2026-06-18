import { memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/analyticsHelpers.js';
import { useTheme } from '../../context/ThemeContext';

const RevenueTooltip = ({ active, payload, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-xl text-sm transition-colors duration-200">
      <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">{d.month} Revenue</p>
      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(d.revenue)}</p>
    </div>
  );
};

/**
 * RevenueChartCard — Won deal revenue area chart (last 6 months).
 * @param {{ revenueByMonth: Array<{month:string, revenue:number}> }} props
 */
const RevenueChartCard = memo(function RevenueChartCard({ revenueByMonth = [] }) {
  const { isDarkMode } = useTheme();

  if (!revenueByMonth.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <p className="text-sm text-gray-400 dark:text-gray-500">No revenue data yet</p>
      </div>
    );
  }

  const totalRevenue = revenueByMonth.reduce((s, m) => s + m.revenue, 0);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Revenue Analytics</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Won deals · last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">6-month total</p>
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-450">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueByMonth} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
            />
            <Tooltip content={<RevenueTooltip isDarkMode={isDarkMode} />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22C55E"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ fill: isDarkMode ? '#1f2937' : '#fff', stroke: '#22C55E', strokeWidth: 2.5, r: 4 }}
              activeDot={{ fill: '#22C55E', stroke: isDarkMode ? '#1f2937' : '#fff', strokeWidth: 2, r: 6 }}
              animationBegin={0}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default RevenueChartCard;
