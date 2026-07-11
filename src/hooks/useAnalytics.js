import { useMemo, useEffect } from 'react';
import { useLeads } from '../context/LeadContext.jsx';
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers.js';

/**
 * useAnalytics
 *
 * Custom hook that derives all analytics metrics from the leads array in a
 * single memoized pass. Components should import this hook rather than
 * calling individual helpers directly, to avoid duplicated computation.
 *
 * @returns {Object} All analytics datasets and KPI values
 */
export function useAnalytics() {
  const { leads = [], fetchLeads } = useLeads();

  // Fetch leads on mount if navigating directly to analytics
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /** ── Summary KPIs ── */
  const totalLeads = useMemo(() => leads.length, [leads]);

  const wonCount = useMemo(
    () => leads.filter((l) => l.status === 'Won').length,
    [leads]
  );

  const conversionRate = useMemo(
    () => (totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0),
    [wonCount, totalLeads]
  );

  const pipelineValue = useMemo(() => getPipelineValue(leads), [leads]);
  const wonRevenue    = useMemo(() => getWonRevenue(leads),    [leads]);
  const avgSalesCycle = useMemo(() => getAverageSalesCycle(leads), [leads]);
  const lostRate      = useMemo(() => getLostRate(leads),      [leads]);
  const salesVelocity = useMemo(() => getSalesVelocity(leads), [leads]);
  const forecastRevenue = useMemo(() => getForecastRevenue(leads), [leads]);

  /** ── Chart datasets ── */
  const statusDistribution = useMemo(() => getStatusDistribution(leads), [leads]);
  const monthlyLeads       = useMemo(() => getMonthlyLeads(leads, 6),    [leads]);
  const conversionByMonth  = useMemo(() => getConversionByMonth(leads, 6), [leads]);
  const revenueByMonth     = useMemo(() => getRevenueByMonth(leads, 6),  [leads]);
  const leadSourceStats    = useMemo(() => getLeadSourceStats(leads),    [leads]);
  const funnelData         = useMemo(() => getFunnelData(leads),         [leads]);
  const topPerformers      = useMemo(() => getTopPerformers(leads, 5),   [leads]);
  const activityHeatmap    = useMemo(() => getActivityHeatmapData(leads, 90), [leads]);

  return {
    // Raw
    leads,
    hasData: totalLeads > 0,

    // KPIs
    totalLeads,
    wonCount,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
    salesVelocity,
    forecastRevenue,

    // Charts
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    topPerformers,
    activityHeatmap,
  };
}
