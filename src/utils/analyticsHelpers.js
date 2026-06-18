/**
 * Analytics data-transformation helpers.
 *
 * These pure functions turn the raw `leads` array (from the leads context) into
 * the shapes consumed by the Recharts visualizations on the Analytics page.
 */

/**
 * Canonical pipeline status order and the brand colors used for each status
 * across the analytics charts and legends.
 * @type {Array<{ status: string, color: string }>}
 */
export const STATUS_CONFIG = [
  { status: 'New', color: '#94A3B8' },
  { status: 'Contacted', color: '#2563EB' },
  { status: 'Meeting Scheduled', color: '#F59E0B' },
  { status: 'Proposal Sent', color: '#7C3AED' },
  { status: 'Won', color: '#22C55E' },
  { status: 'Lost', color: '#EF4444' },
];

/**
 * Short month labels indexed 0-11 (Jan..Dec).
 * @type {string[]}
 */
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Resolve the creation Date for a lead, tolerating either the ISO `createdAt`
 * field or the legacy `date` (YYYY-MM-DD) field.
 * @param {Object} lead
 * @returns {Date | null} A valid Date, or null when neither field is parseable.
 */
function getLeadDate(lead) {
  const raw = lead?.createdAt ?? lead?.date;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Build a list of the last `count` months (oldest → newest) ending at the
 * month of `reference`, each described by its label and year/month keys.
 * @param {number} [count=6]
 * @param {Date}   [reference=new Date()]
 * @returns {Array<{ label: string, year: number, month: number, key: string }>}
 */
function getRecentMonths(count = 6, reference = new Date()) {
  const months = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(reference.getFullYear(), reference.getMonth() - i, 1);
    months.push({
      label: MONTH_LABELS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
      key: `${d.getFullYear()}-${d.getMonth()}`,
    });
  }
  return months;
}

/**
 * Count leads per pipeline status for the pie chart.
 * Only statuses with at least one lead are returned, preserving pipeline order.
 * @param {Array<Object>} leads
 * @returns {Array<{ name: string, value: number, color: string, percentage: number }>}
 */
export function getStatusDistribution(leads = []) {
  const total = leads.length;
  return STATUS_CONFIG.map(({ status, color }) => {
    const value = leads.filter((lead) => lead.status === status).length;
    return {
      name: status,
      value,
      color,
      percentage: total === 0 ? 0 : Math.round((value / total) * 100),
    };
  }).filter((entry) => entry.value > 0);
}

/**
 * Group leads by month for the last `months` months (bar chart).
 * @param {Array<Object>} leads
 * @param {number} [months=6]
 * @returns {Array<{ month: string, leads: number }>}
 */
export function getMonthlyLeads(leads = [], months = 6) {
  const buckets = getRecentMonths(months);
  const counts = new Map(buckets.map((b) => [b.key, 0]));

  leads.forEach((lead) => {
    const date = getLeadDate(lead);
    if (!date) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (counts.has(key)) counts.set(key, counts.get(key) + 1);
  });

  return buckets.map((b) => ({ month: b.label, leads: counts.get(b.key) }));
}

/**
 * Compute the monthly conversion rate (Won / total leads created that month)
 * as a percentage for the last `months` months (line chart).
 * @param {Array<Object>} leads
 * @param {number} [months=6]
 * @returns {Array<{ month: string, rate: number, won: number, total: number }>}
 */
export function getConversionByMonth(leads = [], months = 6) {
  const buckets = getRecentMonths(months);
  const stats = new Map(buckets.map((b) => [b.key, { won: 0, total: 0 }]));

  leads.forEach((lead) => {
    const date = getLeadDate(lead);
    if (!date) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = stats.get(key);
    if (!bucket) return;
    bucket.total += 1;
    if (lead.status === 'Won') bucket.won += 1;
  });

  return buckets.map((b) => {
    const { won, total } = stats.get(b.key);
    const rate = total === 0 ? 0 : Math.round((won / total) * 100);
    return { month: b.label, rate, won, total };
  });
}

/**
 * Aggregate the headline summary stats shown at the top of the Analytics page.
 * @param {Array<Object>} leads
 * @returns {{ totalLeads: number, wonRate: number, avgTimeToClose: number | null }}
 *   `wonRate` is a whole-number percentage; `avgTimeToClose` is the average
 *   number of days between a Won lead's creation and "now" (null when none).
 */
export function getSummaryStats(leads = []) {
  const totalLeads = leads.length;
  const wonLeads = leads.filter((lead) => lead.status === 'Won');
  const wonRate = totalLeads === 0 ? 0 : Math.round((wonLeads.length / totalLeads) * 100);

  let avgTimeToClose = null;
  if (wonLeads.length > 0) {
    const now = Date.now();
    const totalDays = wonLeads.reduce((sum, lead) => {
      const date = getLeadDate(lead);
      if (!date) return sum;
      const days = Math.max(0, Math.round((now - date.getTime()) / 86_400_000));
      return sum + days;
    }, 0);
    avgTimeToClose = Math.round(totalDays / wonLeads.length);
  }

  return { totalLeads, wonRate, avgTimeToClose };
}
