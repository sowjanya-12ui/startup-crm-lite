// Import React for JSX compilation and component creation
import React from 'react';
// Import trend arrow icon from lucide-react for percentage change indicator
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * StatsCard — Displays a single KPI metric on the dashboard.
 *
 * Renders an icon, a large numeric value, a descriptive title, and a
 * percentage-change indicator compared to the previous month. Supports
 * multiple color themes via the `color` prop.
 *
 * @component
 * @param {Object}             props          - Component props.
 * @param {string}             props.title    - Metric label (e.g. "Total Leads").
 * @param {string|number}      props.value    - Metric value to display prominently.
 * @param {React.ElementType}  props.icon     - Lucide icon component reference.
 * @param {number}             props.change   - Percentage change vs last month (positive or negative).
 * @param {string}             [props.color='blue'] - Theme color key: 'blue' | 'indigo' | 'emerald' | 'amber' | 'red'.
 * @returns {JSX.Element}      The rendered StatsCard component.
 *
 * @example
 * <StatsCard
 *   title="Total Leads"
 *   value="1,248"
 *   icon={Users}
 *   change={12.4}
 *   color="blue"
 * />
 */
export default function StatsCard({ title, value, icon: Icon, change, color = 'blue' }) {
  // Map color keys to Tailwind utility class fragments for icon container and text
  const colorMap = {
    blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-500' },
    indigo:  { bg: 'bg-indigo-500/10',  text: 'text-indigo-400' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400' },
    red:     { bg: 'bg-red-500/10',     text: 'text-red-400' },
  };

  // Resolve color classes for current theme, fallback to blue
  const scheme = colorMap[color] || colorMap.blue;

  // Determine whether the change is positive (growth) or negative (decline)
  const isPositive = change >= 0;

  return (
    // Card container with glass-morphism dark theme, hover lift animation
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:bg-slate-900/80">
      {/* Top row: metric info left, icon right */}
      <div className="flex items-center justify-between">
        <div>
          {/* Metric title label */}
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {/* Large metric value */}
          <p className="mt-2.5 text-3xl font-bold text-white">{value}</p>
        </div>
        {/* Themed icon container with scale-up on card hover */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-110 transition-transform duration-300`}
        >
          {/* Render the passed Lucide icon */}
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Bottom row: percentage change indicator */}
      <div
        className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {/* Directional arrow icon based on change polarity */}
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        {/* Formatted percentage string */}
        <span>
          {isPositive ? '+' : ''}
          {change}%
        </span>
        {/* Context label */}
        <span className="font-normal text-slate-500">from last month</span>
      </div>
    </div>
  );
}
