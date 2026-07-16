import { memo } from 'react';

const STAGE_ORDER = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];
const STAGE_LABELS = {
  'New': 'New',
  'Contacted': 'Contacted',
  'Meeting': 'Meeting',
  'Proposal': 'Proposal',
  'Won': 'Won',
};
const STAGE_COLORS = {
  'New': '#94A3B8',
  'Contacted': '#2563EB',
  'Meeting': '#F59E0B',
  'Proposal': '#7C3AED',
  'Won': '#22C55E',
};

/**
 * FunnelChartCard — Custom SVG funnel showing lead counts and conversion % per stage.
 * @param {{ funnelData: Array }} props
 */
const FunnelChartCard = memo(function FunnelChartCard({ funnelData = [] }) {
  if (!funnelData.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-border-main bg-surface shadow-sm transition-colors duration-200">
        <p className="text-sm text-text-secondary dark:text-text-secondary">No funnel data yet</p>
      </div>
    );
  }

  const maxCount = funnelData[0]?.count || 1;

  return (
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-5">
        <h3 className="text-base font-bold text-text-main">Sales Funnel</h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary mt-0.5">Conversion through each pipeline stage</p>
      </div>

      <div className="space-y-2.5">
        {funnelData.map((stage, idx) => {
          const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const color = STAGE_COLORS[stage.stage] ?? STAGE_COLORS[STAGE_ORDER[idx]] ?? '#94A3B8';
          const label = STAGE_LABELS[stage.stage] ?? stage.stage;

          return (
            <div key={stage.stage} className="group">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-semibold text-text-secondary">{label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-text-main">{stage.count}</span>
                  {idx > 0 && stage.pct != null && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      stage.pct >= 70
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : stage.pct >= 40
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400'
                    }`}>
                      {stage.pct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-7 w-full rounded-lg bg-surface overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-700 ease-out"
                  style={{ width: `${widthPct}%`, backgroundColor: color, opacity: 0.85 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      {funnelData.length >= 2 && (
        <div className="mt-5 flex items-center justify-between rounded-xl bg-background border border-border-main px-4 py-3">
          <span className="text-xs font-medium text-text-secondary">Overall conversion</span>
          <span className="text-sm font-extrabold text-text-main">
            {funnelData[0]?.count > 0
              ? `${Math.round(((funnelData[funnelData.length - 1]?.count || 0) / funnelData[0].count) * 100)}%`
              : '—'}
          </span>
        </div>
      )}
    </div>
  );
});

export default FunnelChartCard;
