import { memo } from 'react';
import { Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers.js';

/**
 * SalesVelocityCard
 * Formula: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length
 * @param {{ salesVelocity: number, conversionRate: number, avgSalesCycle: number }} props
 */
const SalesVelocityCard = memo(function SalesVelocityCard({
  salesVelocity = 0,
  conversionRate = 0,
  avgSalesCycle = 0,
}) {
  const isHealthy = salesVelocity > 0;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Sales Velocity</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Revenue generated per day</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30">
          <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
      </div>

      {/* Main metric */}
      <div className="mb-6">
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {isHealthy ? `${formatCurrency(salesVelocity)}/day` : '—'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-550 mt-1">
          {isHealthy ? 'Active pipeline velocity' : 'Add Won leads with values to calculate'}
        </p>
      </div>

      {/* Formula breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-405">Win Rate</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{conversionRate}%</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-405">Avg Sales Cycle</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {avgSalesCycle > 0 ? `${avgSalesCycle} days` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-gray-500 dark:text-gray-455">Formula</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-550 italic">(Opp × WR × Deal) ÷ Cycle</span>
        </div>
      </div>

      {/* Health indicator */}
      <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 ${
        isHealthy
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30'
          : 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700'
      }`}>
        <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
        <span className={`text-xs font-semibold ${isHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {isHealthy ? 'Pipeline generating revenue' : 'No velocity data available'}
        </span>
      </div>
    </div>
  );
});

export default SalesVelocityCard;
