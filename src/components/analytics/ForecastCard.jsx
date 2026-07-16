import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers.js';

/**
 * ForecastCard
 * Predicted next-month revenue based on average of last 6 months.
 * @param {{ forecastRevenue: number, revenueByMonth: Array }} props
 */
const ForecastCard = memo(function ForecastCard({ forecastRevenue = 0, revenueByMonth = [] }) {
  const hasData = revenueByMonth.some((m) => m.revenue > 0);
  const lastMonthRevenue = revenueByMonth[revenueByMonth.length - 1]?.revenue ?? 0;
  const growth = lastMonthRevenue > 0
    ? Math.round(((forecastRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;
  const isPositive = growth >= 0;

  // Confidence: higher when revenue data is consistent
  const nonZero = revenueByMonth.filter((m) => m.revenue > 0).length;
  const confidence = Math.min(Math.round((nonZero / 6) * 100), 95);

  return (
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-text-main">Revenue Forecast</h3>
          <p className="text-xs text-text-secondary dark:text-text-secondary mt-0.5">Next month prediction</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30">
          <TrendingUp className="h-5 w-5 text-primary dark:text-primary" />
        </div>
      </div>

      {/* Predicted value */}
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary mb-1">
          Predicted Revenue
        </p>
        <p className="text-3xl font-extrabold text-text-main tracking-tight">
          {hasData ? formatCurrency(forecastRevenue) : '—'}
        </p>
      </div>

      {/* Growth vs last month */}
      {hasData && lastMonthRevenue > 0 && (
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mt-2 ${
          isPositive ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400'
        }`}>
          <TrendingUp className={`h-3.5 w-3.5 ${!isPositive ? 'rotate-180' : ''}`} />
          {isPositive ? '+' : ''}{growth}% vs last month
        </div>
      )}

      {/* Monthly mini bars */}
      {revenueByMonth.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary mb-2">6-Month History</p>
          <div className="flex items-end gap-1 h-14">
            {revenueByMonth.map((m, i) => {
              const max = Math.max(...revenueByMonth.map((x) => x.revenue), 1);
              const h = Math.max((m.revenue / max) * 100, m.revenue > 0 ? 8 : 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-blue-200 dark:bg-blue-900/60 transition-all duration-500"
                    style={{ height: `${h}%` }}
                    title={`${m.month}: ${formatCurrency(m.revenue)}`}
                  />
                  <span className="text-[9px] text-text-secondary dark:text-text-secondary">{m.month}</span>
                </div>
              );
            })}
            {/* Forecast bar */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-primary border-2 border-dashed border-blue-400 transition-all duration-500"
                style={{ height: `${Math.min(100, forecastRevenue / Math.max(...revenueByMonth.map(x => x.revenue), 1) * 100)}%` }}
                title={`Forecast: ${formatCurrency(forecastRevenue)}`}
              />
              <span className="text-[9px] text-primary font-bold">Fcst</span>
            </div>
          </div>
        </div>
      )}

      {/* Confidence */}
      {hasData && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-background border border-border-main px-4 py-2.5 transition-colors duration-200">
          <span className="text-xs text-text-secondary">Confidence Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${confidence}%` }} />
            </div>
            <span className="text-xs font-bold text-primary dark:text-primary">{confidence}%</span>
          </div>
        </div>
      )}

      {!hasData && (
        <p className="mt-4 text-xs text-text-secondary">
          Close deals with revenue values to generate forecasts.
        </p>
      )}
    </div>
  );
});

export default ForecastCard;
