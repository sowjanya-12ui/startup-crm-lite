import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const RANGES = [
  { label: 'Last 7 Days',  value: '7d'   },
  { label: 'Last 30 Days', value: '30d'  },
  { label: 'Last 90 Days', value: '90d'  },
  { label: 'This Year',    value: 'year' },
];

/**
 * AnalyticsFilters
 *
 * Date-range filter strip. Calls onRangeChange(value) when user selects a
 * range so the parent page can pass it down to useAnalytics / memoized helpers.
 *
 * @param {{ range: string, onRangeChange: (v:string)=>void }} props
 */
export default function AnalyticsFilters({ range, onRangeChange }) {
  const [open, setOpen] = useState(false);
  const active = RANGES.find((r) => r.value === range) ?? RANGES[1];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Pill buttons — desktop */}
      <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border-main bg-surface p-1 shadow-sm">
        {RANGES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onRangeChange(r.value)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              range === r.value
                ? 'bg-primary text-white shadow-sm shadow-blue-200'
                : 'text-text-secondary hover:bg-background hover:text-text-secondary'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Dropdown — mobile */}
      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-xl border border-border-main bg-surface px-4 py-2 text-sm font-medium text-text-secondary shadow-sm hover:bg-background transition-colors"
        >
          <Calendar className="h-4 w-4 text-primary" />
          {active.label}
          <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-1 z-20 w-44 rounded-xl border border-border-main bg-surface shadow-lg py-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => { onRangeChange(r.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  range === r.value
                    ? 'bg-blue-50 text-primary font-semibold'
                    : 'text-text-secondary hover:bg-background'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
