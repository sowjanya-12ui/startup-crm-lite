import React from 'react';

/**
 * FilterBar - A row of clickable filter buttons with lead counts.
 * 
 * Features:
 * - Clickable filter buttons: All, New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost
 * - Active filter button highlighted with blue primary color
 * - Shows count of leads for each filter in parentheses
 * - Smooth transitions when filter changes
 * 
 * @param {Object} props
 * @param {string} props.activeFilter - Currently active filter
 * @param {function} props.onFilterChange - Callback when filter changes
 * @param {Array<Object>} props.leads - Array of leads to calculate counts
 * @returns {JSX.Element}
 */
export default function FilterBar({ activeFilter, onFilterChange, leads }) {
  const filterOptions = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // Calculate count for each filter option
  const getCount = (filter) => {
    if (filter === 'All') {
      return leads.length;
    }
    return leads.filter(lead => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((filter) => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-primary text-white shadow-lg shadow-blue-500/25 hover:bg-primary'
                : 'bg-surface  text-text-secondary  hover:bg-surface dark:hover:bg-surface hover:text-text-main dark:hover:text-white'
            }`}
            aria-label={`Filter by ${filter}`}
            aria-pressed={isActive}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
}
