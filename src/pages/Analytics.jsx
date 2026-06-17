// Import React and standard hooks to enable JSX rendering
import React from 'react';
// Import Recharts visualizations to build data analytics reports
import { BarChart, Bar, LineChart, Line, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Import Lucide icons representing sales data metrics and labels
import { BarChart3, TrendingUp, Percent, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock dataset for lead acquisitions categorized by channel
const leadSourceData = [
  { name: 'Organic Search', leads: 420, value: '#3b82f6' },
  { name: 'Paid Ads', leads: 310, value: '#6366f1' },
  { name: 'Referrals', leads: 240, value: '#10b981' },
  { name: 'Social Media', leads: 180, value: '#f59e0b' },
  { name: 'Outbound', leads: 98, value: '#ec4899' },
];

// Mock dataset mapping pipeline conversions per stage
const stageDistributionData = [
  { name: 'New', value: 150 },
  { name: 'Contacted', value: 280 },
  { name: 'Proposal', value: 190 },
  { name: 'Won Deals', value: 420 },
  { name: 'Lost Opportunities', value: 80 },
];

// Colors palette matching our dark UI design to color the PieChart slices
const COLORS = ['#64748b', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

// Mock dataset showing monthly deals growth and sales velocity index
const dealsGrowthData = [
  { month: 'Jan', dealsClosed: 12, avgSalesCycle: 19 },
  { month: 'Feb', dealsClosed: 18, avgSalesCycle: 17 },
  { month: 'Mar', dealsClosed: 15, avgSalesCycle: 18 },
  { month: 'Apr', dealsClosed: 26, avgSalesCycle: 15 },
  { month: 'May', dealsClosed: 22, avgSalesCycle: 14 },
  { month: 'Jun', dealsClosed: 35, avgSalesCycle: 12 },
];

// Main Analytics page component function definition
export default function Analytics() {
  return (
    // Base layout component setup with styling matching the application theme
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      
      {/* Maximum width container */}
      <div className="mx-auto max-w-7xl">
        
        {/* Page title and description section */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Performance Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Deep dive into acquisition channels, conversions, and revenue growth indexes.
          </p>
        </div>

        {/* 4 Stats Cards grid for analytic metrics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Analytics Stat Card 1: Conversion efficiency */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Stat label */}
              <span className="text-sm font-semibold text-slate-400">Conversion Rate</span>
              {/* Percentage Icon */}
              <Percent className="h-4 w-4 text-indigo-400" />
            </div>
            {/* Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">18.6%</span>
              <span className="flex items-center text-xs font-bold text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                +2.4%
              </span>
            </div>
            {/* Description context */}
            <p className="mt-1.5 text-xs text-slate-500">Pipeline to Closed-Won ratio</p>
          </div>

          {/* Analytics Stat Card 2: Average Deal Value */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Stat label */}
              <span className="text-sm font-semibold text-slate-400">Average Deal Size</span>
              {/* Currency Icon */}
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            {/* Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">$14,800</span>
              <span className="flex items-center text-xs font-bold text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                +11.2%
              </span>
            </div>
            {/* Description context */}
            <p className="mt-1.5 text-xs text-slate-500">Avg value per closed deal</p>
          </div>

          {/* Analytics Stat Card 3: Avg Closed velocity time */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Stat label */}
              <span className="text-sm font-semibold text-slate-400">Sales Velocity</span>
              {/* Calendar Icon */}
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
            {/* Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">14.2 Days</span>
              <span className="flex items-center text-xs font-bold text-emerald-400">
                <ArrowDownRight className="h-3 w-3" />
                -2.8 Days
              </span>
            </div>
            {/* Description context */}
            <p className="mt-1.5 text-xs text-slate-500">Avg days from Lead to Won</p>
          </div>

          {/* Analytics Stat Card 4: Total Revenue Growth index */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Stat label */}
              <span className="text-sm font-semibold text-slate-400">MRR Growth</span>
              {/* Trend Icon */}
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            {/* Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">$64,500</span>
              <span className="flex items-center text-xs font-bold text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                +22.4%
              </span>
            </div>
            {/* Description context */}
            <p className="mt-1.5 text-xs text-slate-500">Monthly recurring revenue index</p>
          </div>

        </div>

        {/* Charts Layout grid: Top row is 2 column layout containing Bar Chart and Pie Chart */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Chart Container 1: Lead Sources (Bar Chart) */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              {/* Icon */}
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {/* Title */}
              <h2 className="text-lg font-bold text-white">Acquisition Channels</h2>
            </div>
            {/* Chart Container wrapper */}
            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* Horizontal Bar Chart showing lead counts */}
                <BarChart data={leadSourceData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  {/* Colored single bar rendering */}
                  <Bar dataKey="leads" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={14}>
                    {/* Maps cell specific colors */}
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Container 2: Conversion Funnel Stage Distribution (Donut Pie Chart) */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Pipeline Status Split</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Distribution</span>
            </div>
            {/* Chart Area wrapper */}
            <div className="mt-6 flex flex-col items-center justify-center sm:flex-row gap-6">
              
              {/* Left element containing PieChart visualization */}
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* Donut chart defined by innerRadius setting */}
                    <Pie
                      data={stageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {/* Distributes predefined colors to donut pieces */}
                      {stageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Right element containing custom legend breakdown details */}
              <div className="flex-1 space-y-3.5">
                {/* Map stages to labels lists */}
                {stageDistributionData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Color bullet dot */}
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="font-medium text-slate-400">{entry.name}</span>
                    </div>
                    {/* Numeric Count details */}
                    <span className="font-bold text-white">{entry.value} leads</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Charts Layout grid: Bottom row contains Line Chart for performance growth */}
        <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Closed Deals vs Sales Cycle Velocity</h2>
              <p className="text-xs text-slate-400">Compares closed lead velocity against cycle speeds (days)</p>
            </div>
          </div>
          {/* Chart container */}
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Dual Y-axis line chart */}
              <LineChart data={dealsGrowthData} margin={{ top: 10, right: -5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                {/* Left Y Axis for Closed counts */}
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
                {/* Right Y Axis for sales cycle days count */}
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                {/* Line 1: Closed Deals counts (referenced on left axis) */}
                <Line yAxisId="left" type="monotone" dataKey="dealsClosed" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} name="Deals Closed" />
                {/* Line 2: Sales cycle count in days (referenced on right axis) */}
                <Line yAxisId="right" type="monotone" dataKey="avgSalesCycle" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} activeDot={{ r: 7 }} name="Avg Sales Cycle (Days)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
