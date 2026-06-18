/**
 * analyticsHelpers.js
 *
 * Pure utility functions for computing analytics metrics from a leads array.
 * All functions are memoization-friendly (deterministic, no side-effects).
 */

// ─── Formatting ────────────────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency string.
 * @param {number} value
 * @returns {string} e.g. "₹1,20,000"
 */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '₹0';
  return '₹' + Number(value).toLocaleString('en-IN');
}

/**
 * Get a date N months ago from today.
 * @param {number} n
 * @returns {Date}
 */
function nMonthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get abbreviated month label e.g. "Jan", "Feb".
 * @param {Date} date
 * @returns {string}
 */
function monthLabel(date) {
  return date.toLocaleString('en-US', { month: 'short' });
}

// ─── KPI Helpers ───────────────────────────────────────────────────────────────

/**
 * Sum of value for all non-Lost, non-Won leads (active pipeline).
 * @param {Array} leads
 * @returns {number}
 */
export function getPipelineValue(leads = []) {
  return leads
    .filter((l) => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
}

/**
 * Sum of value for all Won leads.
 * @param {Array} leads
 * @returns {number}
 */
export function getWonRevenue(leads = []) {
  return leads
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
}

/**
 * Average days from createdAt → wonAt for Won leads.
 * @param {Array} leads
 * @returns {number} integer days
 */
export function getAverageSalesCycle(leads = []) {
  const wonWithDates = leads.filter(
    (l) => l.status === 'Won' && l.createdAt && l.wonAt
  );
  if (!wonWithDates.length) return 0;
  const totalDays = wonWithDates.reduce((sum, l) => {
    const diff =
      (new Date(l.wonAt).getTime() - new Date(l.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return sum + diff;
  }, 0);
  return Math.round(totalDays / wonWithDates.length);
}

/**
 * Percentage of leads with status === 'Lost'.
 * @param {Array} leads
 * @returns {number} 0-100
 */
export function getLostRate(leads = []) {
  if (!leads.length) return 0;
  const lost = leads.filter((l) => l.status === 'Lost').length;
  return Math.round((lost / leads.length) * 100);
}

// ─── Chart Data Helpers ────────────────────────────────────────────────────────

/**
 * Count leads by status.
 * @param {Array} leads
 * @returns {Array<{name: string, value: number}>}
 */
const STATUS_COLORS = {
  New:       '#94A3B8',
  Contacted: '#2563EB',
  Meeting:   '#F59E0B',
  Proposal:  '#7C3AED',
  Won:       '#22C55E',
  Lost:      '#EF4444',
};

export function getStatusDistribution(leads = []) {
  const counts = {};
  leads.forEach((l) => {
    counts[l.status] = (counts[l.status] || 0) + 1;
  });
  const total = leads.length || 1;
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name] || '#9ca3af',
    percentage: Math.round((value / total) * 100),
  }));
}

/**
 * Monthly lead counts for last N months.
 * @param {Array} leads
 * @param {number} months
 * @returns {Array<{month: string, count: number}>}
 */
export function getMonthlyLeads(leads = [], months = 6) {
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const count = leads.filter((l) => {
      if (!l.createdAt) return false;
      const ld = new Date(l.createdAt);
      return ld.getFullYear() === yr && ld.getMonth() === mo;
    }).length;
    result.push({ month: monthLabel(d), count });
  }
  return result;
}

/**
 * Monthly conversion rate (Won / Total) for last N months.
 * @param {Array} leads
 * @param {number} months
 * @returns {Array<{month: string, conversion: number}>}
 */
export function getConversionByMonth(leads = [], months = 6) {
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const monthLeads = leads.filter((l) => {
      if (!l.createdAt) return false;
      const ld = new Date(l.createdAt);
      return ld.getFullYear() === yr && ld.getMonth() === mo;
    });
    const won = monthLeads.filter((l) => l.status === 'Won').length;
    const conversion =
      monthLeads.length > 0 ? Math.round((won / monthLeads.length) * 100) : 0;
    result.push({ month: monthLabel(d), conversion });
  }
  return result;
}

/**
 * Monthly Won revenue for last N months.
 * @param {Array} leads
 * @param {number} months
 * @returns {Array<{month: string, revenue: number}>}
 */
export function getRevenueByMonth(leads = [], months = 6) {
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const revenue = leads
      .filter((l) => {
        if (l.status !== 'Won' || !l.wonAt) return false;
        const wd = new Date(l.wonAt);
        return wd.getFullYear() === yr && wd.getMonth() === mo;
      })
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
    result.push({ month: monthLabel(d), revenue });
  }
  return result;
}

/**
 * Leads grouped by source, sorted descending by count.
 * @param {Array} leads
 * @returns {Array<{source: string, count: number}>}
 */
export function getLeadSourceStats(leads = []) {
  const counts = {};
  leads.forEach((l) => {
    if (l.source) counts[l.source] = (counts[l.source] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Funnel data — count per pipeline stage with conversion %.
 * @param {Array} leads
 * @returns {Array<{stage: string, count: number, pct: number}>}
 */
export function getFunnelData(leads = []) {
  const stages = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];
  const counts = stages.map((stage) => ({
    stage,
    count: leads.filter((l) => l.status === stage).length,
  }));
  const topCount = counts[0]?.count || 1;
  return counts.map((s) => ({
    ...s,
    pct: topCount > 0 ? Math.round((s.count / topCount) * 100) : 0,
  }));
}

/**
 * Sales velocity = (Opportunities × WinRate × AvgDealSize) / SalesCycleDays
 * @param {Array} leads
 * @returns {number} revenue per day
 */
export function getSalesVelocity(leads = []) {
  const total = leads.length;
  if (!total) return 0;
  const won = leads.filter((l) => l.status === 'Won');
  const winRate = total > 0 ? won.length / total : 0;
  const avgDeal =
    won.length > 0
      ? won.reduce((s, l) => s + (Number(l.value) || 0), 0) / won.length
      : 0;
  const cycle = getAverageSalesCycle(leads) || 30;
  return Math.round((total * winRate * avgDeal) / cycle);
}

/**
 * Forecast next month revenue based on avg of last 6 months.
 * @param {Array} leads
 * @returns {number}
 */
export function getForecastRevenue(leads = []) {
  const rev = getRevenueByMonth(leads, 6);
  const total = rev.reduce((s, r) => s + r.revenue, 0);
  const nonZero = rev.filter((r) => r.revenue > 0).length;
  if (!nonZero) return 0;
  return Math.round(total / nonZero);
}

/**
 * Top N performers ranked by Won revenue.
 * @param {Array} leads
 * @param {number} n
 * @returns {Array<{owner: string, revenue: number, deals: number}>}
 */
export function getTopPerformers(leads = [], n = 5) {
  const map = {};
  leads
    .filter((l) => l.status === 'Won' && l.owner)
    .forEach((l) => {
      if (!map[l.owner]) map[l.owner] = { owner: l.owner, revenue: 0, deals: 0 };
      map[l.owner].revenue += Number(l.value) || 0;
      map[l.owner].deals += 1;
    });
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

/**
 * GitHub-style activity heatmap data for last N days.
 * @param {Array} leads
 * @param {number} days
 * @returns {Array<{date: string, count: number}>}
 */
export function getActivityHeatmapData(leads = [], days = 90) {
  const map = {};
  const now = new Date();

  // Pre-fill all days in range with 0
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key] = 0;
  }

  // Increment for createdAt, meetingAt, contactedAt
  const dateFields = ['createdAt', 'meetingAt', 'contactedAt'];
  leads.forEach((l) => {
    dateFields.forEach((field) => {
      if (!l[field]) return;
      const key = new Date(l[field]).toISOString().split('T')[0];
      if (map[key] !== undefined) map[key]++;
    });
  });

  return Object.entries(map).map(([date, count]) => ({ date, count }));
}
