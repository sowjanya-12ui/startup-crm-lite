/**
 * analyticsColors.js
 * Central color palette for all analytics chart components.
 * Import from this file rather than hardcoding hex values in components.
 */

/** Lead pipeline status → chart color mapping */
export const STATUS_COLORS = {
  New:                '#94A3B8',
  Contacted:          '#2563EB',
  'Meeting Scheduled':'#F59E0B',
  'Proposal Sent':    '#7C3AED',
  Won:                '#22C55E',
  Lost:               '#EF4444',
};

/** Shorthand aliases used in some helper returns */
export const STATUS_COLORS_SHORT = {
  New:      '#94A3B8',
  Contacted:'#2563EB',
  Meeting:  '#F59E0B',
  Proposal: '#7C3AED',
  Won:      '#22C55E',
  Lost:     '#EF4444',
};

/** Lead acquisition source → chart color */
export const SOURCE_COLORS = {
  Website:         '#6366F1',
  Referral:        '#22C55E',
  LinkedIn:        '#0EA5E9',
  'Cold Call':     '#F59E0B',
  'Email Campaign':'#EC4899',
  Other:           '#94A3B8',
  Instagram:       '#A855F7',
  Ads:             '#F97316',
};

/** Generic sequential palette for multi-series charts */
export const CHART_COLORS = [
  '#2563EB',
  '#22C55E',
  '#F59E0B',
  '#7C3AED',
  '#EF4444',
  '#0EA5E9',
  '#EC4899',
  '#F97316',
];

/** Semantic colors used in KPI cards */
export const METRIC_COLORS = {
  primary:  '#2563EB',
  success:  '#22C55E',
  warning:  '#F59E0B',
  danger:   '#EF4444',
  purple:   '#7C3AED',
  neutral:  '#94A3B8',
};
