// React for JSX rendering and memoization
import React, { useMemo } from 'react';
// Lucide icons for the summary stat cards and empty state
import { Users, Percent, Clock, BarChart3 } from 'lucide-react';

// Shared leads context (single source of truth)
import { useLeads } from '../context/LeadsContext';
// Summary stat helper
import { getSummaryStats } from '../utils/analyticsHelpers';
// Chart cards
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';

/**
 * Single summary metric card shown in the top stats row.
 * @param {{ title: string, value: string, icon: React.ElementType, hint?: string, accent: string }} props
 * @returns {JSX.Element}
 */
function SummaryCard({ title, value, icon: Icon, hint, accent }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="mt-4 text-3xl font-extrabold text-white">{value}</div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/**
 * Analytics — visualizes the live leads pipeline with summary KPIs and three
 * Recharts visualizations (status distribution, monthly volume, conversion).
 * @returns {JSX.Element}
 */
export default function Analytics() {
  const { leads } = useLeads();
  const { totalLeads, wonRate, avgTimeToClose } = useMemo(
    () => getSummaryStats(leads),
    [leads],
  );

  const hasLeads = totalLeads > 0;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Pipeline insights derived live from your leads.
          </p>
        </div>

        {!hasLeads ? (
          // Page-level empty state when there are zero leads
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 py-20 px-4 text-center">
            <div className="mb-4 rounded-full bg-slate-800/50 p-4">
              <BarChart3 className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-300">No analytics yet</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Add leads in Lead Management to see status distribution, monthly volume,
              and conversion trends here.
            </p>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <SummaryCard
                title="Total Leads"
                value={String(totalLeads)}
                icon={Users}
                accent="text-blue-400"
                hint="Leads currently in your pipeline"
              />
              <SummaryCard
                title="Won Rate"
                value={`${wonRate}%`}
                icon={Percent}
                accent="text-emerald-400"
                hint="Share of leads marked Won"
              />
              <SummaryCard
                title="Avg Time to Close"
                value={avgTimeToClose === null ? '—' : `${avgTimeToClose} days`}
                icon={Clock}
                accent="text-amber-400"
                hint="Average age of Won leads"
              />
            </div>

            {/* Charts grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PieChartCard leads={leads} />
              <BarChartCard leads={leads} />
              <div className="lg:col-span-2">
                <LineChartCard leads={leads} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
