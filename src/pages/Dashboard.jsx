// Import React for JSX compilation and component creation
import React from 'react';
// Import Link from react-router-dom for header CTA navigation
import { Link } from 'react-router-dom';
// Import Recharts components for the pipeline activity area chart
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Import Lucide icons used for KPI cards and header UI
import { Users, DollarSign, Award, TrendingUp, Plus, Activity } from 'lucide-react';
// Import theme context
import { useTheme } from '../context/ThemeContext';

// Import modular dashboard sub-components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * Sample monthly revenue data for the Pipeline Activity area chart.
 * Will be replaced with real API data in Phase 8.
 * @type {Array<{month: string, pipeline: number, won: number}>}
 */
const monthlyData = [
  { month: 'Jan', pipeline: 12000, won: 8000 },
  { month: 'Feb', pipeline: 19000, won: 12000 },
  { month: 'Mar', pipeline: 15000, won: 10000 },
  { month: 'Apr', pipeline: 27000, won: 18000 },
  { month: 'May', pipeline: 22000, won: 15000 },
  { month: 'Jun', pipeline: 32000, won: 24000 },
];

/**
 * Sample leads data used across PipelineOverview and RecentLeads.
 * Will be replaced with real API data in Phase 8.
 * @type {Array<{id: number, name: string, company: string, value: string, status: string, date: string}>}
 */
const sampleLeads = [
  { id: 1, name: 'Sarah Connor',   company: 'Cyberdyne Systems', value: '$8,500',  status: 'Proposal',  date: 'Just now' },
  { id: 2, name: 'Bruce Wayne',    company: 'Wayne Enterprises', value: '$25,000', status: 'Contacted', date: '2 hours ago' },
  { id: 3, name: 'Tony Stark',     company: 'Stark Industries',  value: '$45,000', status: 'Won',       date: '5 hours ago' },
  { id: 4, name: 'Clark Kent',     company: 'Daily Planet',      value: '$3,200',  status: 'New',       date: 'Yesterday' },
  { id: 5, name: 'Diana Prince',   company: 'Themyscira Corp',   value: '$18,000', status: 'Contacted', date: '2 days ago' },
  { id: 6, name: 'Peter Parker',   company: 'Parker Labs',       value: '$7,800',  status: 'New',       date: '3 days ago' },
  { id: 7, name: 'Natasha Romanov',company: 'Red Room Inc',      value: '$12,500', status: 'Proposal',  date: '4 days ago' },
  { id: 8, name: 'Steve Rogers',   company: 'Shield Global',     value: '$35,000', status: 'Won',       date: '5 days ago' },
  { id: 9, name: 'Barry Allen',    company: 'Star Labs',         value: '$9,400',  status: 'New',       date: '6 days ago' },
  { id: 10, name: 'Wanda Maximoff',company: 'Hex Corp',          value: '$6,200',  status: 'Lost',      date: '1 week ago' },
];

/**
 * KPI card configuration array.
 * Each entry maps to one StatsCard rendered in the top metrics grid.
 * @type {Array<{title: string, value: string, icon: React.ElementType, change: number, color: string}>}
 */
const statsConfig = [
  { title: 'Total Leads',     value: '1,248',   icon: Users,      change: 12.4, color: 'blue' },
  { title: 'Conversion Rate', value: '18.6%',   icon: TrendingUp, change: 2.1,  color: 'indigo' },
  { title: 'Pipeline Value',  value: '$92,400',  icon: DollarSign, change: 18.7, color: 'emerald' },
  { title: 'Deals Closed',    value: '42',       icon: Award,      change: 8.3,  color: 'amber' },
];

/**
 * Dashboard — The primary landing page of Startup CRM Lite.
 *
 * Assembles the following sub-components into a responsive grid:
 * - **StatsCard** (×4) — KPI metrics in a 1 / 2 / 4 column responsive grid.
 * - **Pipeline Activity chart** — Recharts AreaChart showing monthly pipeline vs won.
 * - **PipelineOverview** — Horizontal stacked bar of lead statuses.
 * - **RecentLeads** — Table of the 5 most recently added leads.
 * - **QuickActions** — CTA buttons for common workflows.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard page.
 */
export default function Dashboard() {
  const { isDarkMode } = useTheme();

  return (
    // Outer layout wrapper with dark background and responsive padding
    <div className="min-h-screen bg-background px-4 py-8 text-text-main sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full">

        {/* =============================================================== */}
        {/* HEADER — Title, subtitle, and primary CTA                      */}
        {/* =============================================================== */}
        <div className="flex flex-col justify-between gap-4 border-b border-border-main pb-6 sm:flex-row sm:items-center">
          <div>
            {/* Page heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
              CRM Dashboard
            </h1>
            {/* Subtitle */}
            <p className="mt-2 text-sm text-text-secondary">
              Real-time monitoring of your startup's sales pipeline and conversion analytics.
            </p>
          </div>
          {/* Header CTA — navigates to leads management */}
          <Link
            to="/leads"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-primary hover:shadow-blue-500/35 transition-all duration-300"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Manage Leads</span>
          </Link>
        </div>

        {/* =============================================================== */}
        {/* KPI STATS GRID — 1 col mobile / 2 col tablet / 4 col desktop   */}
        {/* =============================================================== */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsConfig.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>

        {/* =============================================================== */}
        {/* CHARTS ROW — Pipeline Activity chart + Quick Actions            */}
        {/* =============================================================== */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Pipeline Activity area chart (spans 2 of 3 columns on lg) */}
          <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm lg:col-span-2 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-border-main pb-4">
              <div>
                {/* Chart title */}
                <h2 className="text-lg font-bold text-text-main">Pipeline Activity</h2>
                {/* Chart description */}
                <p className="text-xs text-text-secondary">Total pipeline vs actual won deals (USD)</p>
              </div>
              {/* Performance badge */}
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-primary">
                <Activity className="h-3.5 w-3.5 text-primary dark:text-primary" />
                <span>Monthly Growth</span>
              </div>
            </div>

            {/* Recharts responsive area chart */}
            <div className="mt-6 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  {/* Gradient fills for the area curves */}
                  <defs>
                    <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Subtle horizontal grid lines */}
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f1f5f9'} vertical={false} />
                  {/* X axis — months */}
                  <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#64748b'} fontSize={11} tickLine={false} axisLine={false} />
                  {/* Y axis — dollar values */}
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#64748b'} fontSize={11} tickLine={false} axisLine={false} />
                  {/* Styled tooltip */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 'bold' }}
                    itemStyle={{ color: isDarkMode ? '#d1d5db' : '#475569' }}
                  />
                  {/* Pipeline area curve */}
                  <Area type="monotone" dataKey="pipeline" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorPipeline)" name="Pipeline" />
                  {/* Won deals area curve */}
                  <Area type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Won Deals" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions panel (spans 1 of 3 columns on lg) */}
          <QuickActions />
        </div>

        {/* =============================================================== */}
        {/* LOWER ROW — Pipeline Overview + Recent Leads                   */}
        {/* =============================================================== */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Pipeline status distribution bar */}
          <PipelineOverview leads={sampleLeads} />
          {/* Recent leads table */}
          <RecentLeads leads={sampleLeads} />
        </div>

      </div>
    </div>
  );
}
