import { memo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/** Custom tooltip */
const PieTooltip = ({ active, payload, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-xl text-sm transition-colors duration-200">
      <p className="font-bold text-gray-800 dark:text-white mb-1">{d.name}</p>
      <p className="text-gray-600 dark:text-gray-300">
        <span className="font-extrabold text-gray-900 dark:text-white">{d.value}</span> Leads
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{d.percentage}% of total</p>
    </div>
  );
};

/** Custom centre label rendered via SVG */
const CentreLabel = ({ cx, cy, totalLeads, isDarkMode }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill={isDarkMode ? '#ffffff' : '#111827'} fontSize={26} fontWeight={800}>
      {totalLeads}
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill={isDarkMode ? '#9ca3af' : '#64748b'} fontSize={11} fontWeight={600} letterSpacing={1}>
      TOTAL LEADS
    </text>
  </>
);

/**
 * PieChartCard
 *
 * Doughnut chart showing lead status distribution.
 *
 * @param {{ statusDistribution: Array, totalLeads: number }} props
 */
const PieChartCard = memo(function PieChartCard({ statusDistribution = [], totalLeads = 0 }) {
  const { isDarkMode } = useTheme();

  if (!statusDistribution.length) {
    return (
      <div className="flex h-[380px] items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <p className="text-sm text-gray-400 dark:text-gray-500">No status data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Lead Status Distribution</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Pipeline stage breakdown</p>
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {statusDistribution.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={entry.color}
                  stroke={isDarkMode ? '#1f2937' : '#ffffff'}
                  strokeWidth={2}
                />
              ))}
              {/* Centre SVG label */}
              <g>
                <CentreLabel cx={null} cy={null} totalLeads={totalLeads} isDarkMode={isDarkMode} />
              </g>
            </Pie>
            <Tooltip content={<PieTooltip isDarkMode={isDarkMode} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {statusDistribution.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 px-3 py-2 transition-colors duration-200"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {item.name}
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {item.value}{' '}
                <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({item.percentage}%)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PieChartCard;
