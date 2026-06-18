import { memo } from 'react';
import { Users, TrendingUp, DollarSign, Award, Clock, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers.js';

/** Single KPI card */
const KPICard = memo(function KPICard({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, trendLabel }) {
  const isPositive = trend >= 0;
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-1">
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-550 mt-1">{subtitle}</p>}
      </div>

      {trendLabel !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {isPositive
            ? <TrendingUp className="h-3.5 w-3.5" />
            : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
});

/**
 * StatsCards
 * Renders the 6 KPI summary cards at the top of the analytics dashboard.
 *
 * @param {{ totalLeads, conversionRate, pipelineValue, wonRevenue, avgSalesCycle, lostRate }} props
 */
export default function StatsCards({
  totalLeads,
  conversionRate,
  pipelineValue,
  wonRevenue,
  avgSalesCycle,
  lostRate,
}) {
  const cards = [
    {
      title:      'Total Leads',
      value:      totalLeads.toLocaleString('en-IN'),
      subtitle:   'All time',
      icon:       Users,
      iconBg:     'bg-blue-50 dark:bg-blue-950/40',
      iconColor:  'text-blue-600 dark:text-blue-400',
      trendLabel: undefined,
    },
    {
      title:      'Conversion Rate',
      value:      `${conversionRate}%`,
      subtitle:   'Won / Total',
      icon:       TrendingUp,
      iconBg:     'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor:  'text-emerald-600 dark:text-emerald-400',
      trend:      conversionRate,
      trendLabel: conversionRate >= 20 ? 'Above target (20%)' : 'Below target (20%)',
    },
    {
      title:      'Pipeline Value',
      value:      formatCurrency(pipelineValue),
      subtitle:   'Active deals',
      icon:       DollarSign,
      iconBg:     'bg-violet-50 dark:bg-violet-950/40',
      iconColor:  'text-violet-600 dark:text-violet-400',
      trendLabel: undefined,
    },
    {
      title:      'Won Revenue',
      value:      formatCurrency(wonRevenue),
      subtitle:   'Closed deals',
      icon:       Award,
      iconBg:     'bg-amber-50 dark:bg-amber-950/40',
      iconColor:  'text-amber-600 dark:text-amber-400',
      trendLabel: undefined,
    },
    {
      title:      'Avg Sales Cycle',
      value:      avgSalesCycle > 0 ? `${avgSalesCycle}d` : '—',
      subtitle:   'Days to close',
      icon:       Clock,
      iconBg:     'bg-cyan-50 dark:bg-cyan-950/40',
      iconColor:  'text-cyan-600 dark:text-cyan-400',
      trendLabel: undefined,
    },
    {
      title:      'Lost Rate',
      value:      `${lostRate}%`,
      subtitle:   'Lost / Total',
      icon:       TrendingDown,
      iconBg:     'bg-red-50 dark:bg-red-950/40',
      iconColor:  'text-red-500 dark:text-red-400',
      trend:      -lostRate,
      trendLabel: lostRate > 30 ? 'High churn — review pipeline' : 'Within healthy range',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}
