import { memo } from 'react';
import { Trophy } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers.js';

const RANK_STYLES = [
  { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-400 text-white', label: '🥇' },
  { bg: 'bg-gray-50 border-gray-200',   badge: 'bg-gray-400 text-white',  label: '🥈' },
  { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-400 text-white', label: '🥉' },
];

/**
 * TopPerformersCard
 * Ranks sales reps by won revenue.
 * @param {{ topPerformers: Array<{name:string, revenue:number}> }} props
 */
const TopPerformersCard = memo(function TopPerformersCard({ topPerformers = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Top Performers</h3>
          <p className="text-xs text-gray-400 mt-0.5">Ranked by won revenue</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </div>

      {topPerformers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-gray-400">No performer data yet</p>
          <p className="text-xs text-gray-300 mt-1">Assign owners to leads and mark them Won</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topPerformers.map((performer, idx) => {
            const style = RANK_STYLES[idx] ?? RANK_STYLES[2];
            const initials = performer.owner
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const maxRevenue = topPerformers[0]?.revenue || 1;
            const barWidth = Math.round((performer.revenue / maxRevenue) * 100);

            return (
              <div
                key={performer.owner}
                className={`flex items-center gap-3 rounded-xl border p-3 ${style.bg}`}
              >
                {/* Rank badge */}
                <span className="text-lg leading-none">{style.label}</span>

                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700">
                  {initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{performer.owner}</p>
                  <p className="text-xs text-gray-400">{performer.deals} deal{performer.deals !== 1 ? 's' : ''}</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Revenue */}
                <span className="text-sm font-extrabold text-gray-900 shrink-0">
                  {formatCurrency(performer.revenue)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default TopPerformersCard;
