import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * EmptyAnalyticsState
 *
 * Shown on the Analytics page when the leads array is empty.
 * Provides a clear CTA to guide users toward adding their first lead.
 */
export default function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 px-8 text-center shadow-sm">
      {/* Icon container */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-6">
        <BarChart3 className="h-10 w-10 text-blue-500" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
        No analytics available yet
      </h2>

      {/* Subtext */}
      <p className="mt-3 max-w-md text-sm text-gray-500 leading-relaxed">
        Add your first lead to start tracking business performance —
        conversion rates, pipeline health, revenue trends, and more will
        appear here automatically.
      </p>

      {/* CTA */}
      <Link
        to="/leads"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all duration-200"
      >
        Add Lead
      </Link>
    </div>
  );
}
