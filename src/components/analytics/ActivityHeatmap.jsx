import { memo, useState } from 'react';

const INTENSITY_COLORS = [
  'bg-surface',       // 0  — empty
  'bg-blue-100',       // 1  — low
  'bg-blue-200',       // 2
  'bg-blue-400',       // 3
  'bg-primary',       // 4  — high
];

function getIntensity(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

/**
 * ActivityHeatmap
 * GitHub-style 90-day contribution heatmap.
 * @param {{ activityHeatmap: Array<{date:string, count:number}> }} props
 */
const ActivityHeatmap = memo(function ActivityHeatmap({ activityHeatmap = [] }) {
  const [tooltip, setTooltip] = useState(null);

  if (!activityHeatmap.length) {
    return (
      <div className="flex h-[180px] items-center justify-center rounded-2xl border border-border-main bg-surface shadow-sm">
        <p className="text-sm text-text-secondary">No activity data yet</p>
      </div>
    );
  }

  // Group into weeks (columns of 7)
  const weeks = [];
  let current = [];
  activityHeatmap.forEach((day, i) => {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length) weeks.push(current);

  // Month labels from first day of each week
  const monthLabels = weeks.map((week) => {
    const d = new Date(week[0].date);
    return d.getDate() <= 7 ? d.toLocaleString('default', { month: 'short' }) : '';
  });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-2xl border border-border-main bg-surface p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-text-main">Activity Heatmap</h3>
          <p className="text-xs text-text-secondary mt-0.5">Lead activity · last 90 days</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-secondary">Less</span>
          {INTENSITY_COLORS.map((cls, i) => (
            <span key={i} className={`h-3 w-3 rounded-sm ${cls} border border-border-main`} />
          ))}
          <span className="text-[10px] text-text-secondary">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-0">
          {/* Day-of-week axis */}
          <div className="flex flex-col gap-0.5 mr-1 mt-5">
            {dayLabels.map((d, i) => (
              <div key={d} className="h-3 flex items-center">
                {i % 2 === 1 && (
                  <span className="text-[9px] text-text-secondary w-6 leading-none">{d.slice(0, 1)}</span>
                )}
                {i % 2 === 0 && <span className="w-6" />}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {/* Month label */}
              <span className="text-[9px] text-text-secondary h-4 leading-none">
                {monthLabels[wi]}
              </span>
              {/* Day cells */}
              {week.map((day) => {
                const intensity = getIntensity(day.count);
                return (
                  <div
                    key={day.date}
                    className={`h-3 w-3 rounded-sm ${INTENSITY_COLORS[intensity]} border border-border-main cursor-pointer transition-transform hover:scale-125`}
                    onMouseEnter={() => setTooltip(day)}
                    onMouseLeave={() => setTooltip(null)}
                    title={`${day.date}: ${day.count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-semibold text-text-secondary">{tooltip.date}</span>
          <span>—</span>
          <span className="font-bold text-text-main">{tooltip.count} activities</span>
        </div>
      )}
    </div>
  );
});

export default ActivityHeatmap;
