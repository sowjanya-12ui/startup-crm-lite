import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics.js';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters.jsx';
import StatsCards       from '../components/analytics/StatsCards.jsx';
import PieChartCard     from '../components/analytics/PieChartCard.jsx';
import FunnelChartCard  from '../components/analytics/FunnelChartCard.jsx';
import BarChartCard     from '../components/analytics/BarChartCard.jsx';
import LineChartCard    from '../components/analytics/LineChartCard.jsx';
import RevenueChartCard from '../components/analytics/RevenueChartCard.jsx';
import LeadSourceChart  from '../components/analytics/LeadSourceChart.jsx';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard.jsx';
import ForecastCard     from '../components/analytics/ForecastCard.jsx';
import ActivityHeatmap  from '../components/analytics/ActivityHeatmap.jsx';
import TopPerformersCard from '../components/analytics/TopPerformersCard.jsx';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState.jsx';

/**
 * Analytics — Production-ready analytics dashboard for Startup CRM Lite.
 *
 * Layout (responsive):
 *  Desktop : 6-col KPI strip → 2-col charts → 2-col charts → full-width → 2-col
 *  Tablet  : 2 columns throughout
 *  Mobile  : single column
 */
export default function Analytics() {
  const [range, setRange] = useState('30d');

  const {
    hasData,
    totalLeads,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
    salesVelocity,
    forecastRevenue,
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    topPerformers,
    activityHeatmap,
  } = useAnalytics();

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8 text-text-main transition-colors duration-200">
      <div className="w-full space-y-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 border-b border-border-main pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-blue-200">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-sm text-text-secondary ml-12">
              Track sales performance, conversion rates, and growth trends.
            </p>
          </div>
          <AnalyticsFilters range={range} onRangeChange={setRange} />
        </div>

        {/* ── Empty state ────────────────────────────────────────────── */}
        {!hasData ? (
          <EmptyAnalyticsState />
        ) : (
          <>
            {/* ── Section 1 — KPI Cards ──────────────────────────────── */}
            <StatsCards
              totalLeads={totalLeads}
              conversionRate={conversionRate}
              pipelineValue={pipelineValue}
              wonRevenue={wonRevenue}
              avgSalesCycle={avgSalesCycle}
              lostRate={lostRate}
            />

            {/* ── Section 2 — Distribution + Funnel ─────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PieChartCard
                statusDistribution={statusDistribution}
                totalLeads={totalLeads}
              />
              <FunnelChartCard funnelData={funnelData} />
            </div>

            {/* ── Section 3 — Bar + Line ─────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <BarChartCard monthlyLeads={monthlyLeads} />
              <LineChartCard conversionByMonth={conversionByMonth} />
            </div>

            {/* ── Section 4 — Revenue + Lead Sources ────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RevenueChartCard revenueByMonth={revenueByMonth} />
              <LeadSourceChart leadSourceStats={leadSourceStats} />
            </div>

            {/* ── Section 5 — Activity Heatmap (full width) ─────────── */}
            <ActivityHeatmap activityHeatmap={activityHeatmap} />

            {/* ── Section 6 — Forecast + Sales Velocity + Performers ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ForecastCard
                forecastRevenue={forecastRevenue}
                revenueByMonth={revenueByMonth}
              />
              <SalesVelocityCard
                salesVelocity={salesVelocity}
                conversionRate={conversionRate}
                avgSalesCycle={avgSalesCycle}
              />
              <TopPerformersCard topPerformers={topPerformers} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
