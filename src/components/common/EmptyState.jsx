import React from 'react';
import { Search, FilterX } from 'lucide-react';

/**
 * EmptyState - Shows when no leads match search/filter criteria.
 * 
 * Features:
 * - Friendly message: "No leads found" with suggestion to clear filters
 * - Different message if there are zero leads total vs zero after filtering
 * - Accessible and visually appealing
 * 
 * @param {Object} props
 * @param {boolean} props.hasFilters - Whether search or filter is active
 * @param {function} props.onClearFilters - Callback to clear all filters
 * @returns {JSX.Element}
 */
export default function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-slate-800/50 p-4">
        {hasFilters ? (
          <FilterX className="h-8 w-8 text-slate-500" />
        ) : (
          <Search className="h-8 w-8 text-slate-500" />
        )}
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        No leads found
      </h3>

      {/* Subtext based on whether filters are active */}
      {hasFilters ? (
        <p className="text-sm text-slate-500 mb-4">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      ) : (
        <p className="text-sm text-slate-500 mb-4">
          There are no leads in your pipeline yet. Add your first lead to get started!
        </p>
      )}

      {/* Clear filters button - only shows when filters are active */}
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
