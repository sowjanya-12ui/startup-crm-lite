// Import React and hooks for state management
import React, { useState } from 'react';
// Import toast notification system from react-hot-toast
import toast from 'react-hot-toast';
// Import Lucide icons for toolbar and view toggle controls
import { Search, Filter, Plus, X, LayoutGrid, List } from 'lucide-react';

// Import modular lead sub-components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
// Import common UI components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * Ordered list of CRM pipeline status filter options.
 * @type {string[]}
 */
const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

/**
 * Initial sample leads dataset — will be replaced with API data in Phase 8.
 * @type {Array<Object>}
 */
const initialLeads = [
  { id: 1,  name: 'Sarah Connor',    company: 'Cyberdyne Systems', email: 'sarah@cyberdyne.co',    phone: '+1 555-0101', status: 'Proposal Sent',     source: 'LinkedIn',        date: '2026-06-15' },
  { id: 2,  name: 'Bruce Wayne',     company: 'Wayne Enterprises', email: 'bruce@wayne.co',        phone: '+1 555-0102', status: 'Contacted',         source: 'Referral',        date: '2026-06-14' },
  { id: 3,  name: 'Tony Stark',      company: 'Stark Industries',  email: 'tony@stark.co',         phone: '+1 555-0103', status: 'Won',               source: 'Website',         date: '2026-06-12' },
  { id: 4,  name: 'Clark Kent',      company: 'Daily Planet',      email: 'clark@dailyplanet.co',  phone: '',            status: 'New',               source: 'Cold Call',       date: '2026-06-11' },
  { id: 5,  name: 'Selina Kyle',     company: 'Gotham Jewels',     email: 'selina@kyle.co',        phone: '+1 555-0105', status: 'Lost',              source: 'Email Campaign',  date: '2026-06-10' },
  { id: 6,  name: 'Barry Allen',     company: 'S.T.A.R. Labs',     email: 'barry@starlabs.co',     phone: '+1 555-0106', status: 'Meeting Scheduled', source: 'Referral',        date: '2026-06-08' },
  { id: 7,  name: 'Diana Prince',    company: 'Themyscira Corp',   email: 'diana@themyscira.co',   phone: '+1 555-0107', status: 'Contacted',         source: 'LinkedIn',        date: '2026-06-07' },
  { id: 8,  name: 'Peter Parker',    company: 'Parker Labs',       email: 'peter@parkerlabs.co',   phone: '',            status: 'New',               source: 'Website',         date: '2026-06-06' },
];

/**
 * LeadManagement — The primary CRUD page for managing CRM leads.
 *
 * Features:
 * - **Search** by name or company (case-insensitive).
 * - **Filter** by pipeline status.
 * - **Toggle** between Card view and Table view.
 * - **Create / Edit** leads via a modal form dialog.
 * - **Delete** leads with confirmation toast.
 * - **Toast notifications** for all CRUD operations (react-hot-toast).
 *
 * @component
 * @returns {JSX.Element} The rendered LeadManagement page.
 */
export default function LeadManagement() {
  // ---- State hooks ----
  // Active leads array
  const [leads, setLeads] = useState(initialLeads);
  // Search input value
  const [searchQuery, setSearchQuery] = useState('');
  // Active filter state
  const [activeFilter, setActiveFilter] = useState('All');
  // Modal visibility flag
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Currently selected lead for editing (null = create mode)
  const [selectedLead, setSelectedLead] = useState(null);
  // View mode toggle: 'table' or 'card'
  const [viewMode, setViewMode] = useState('table');

  // ---- Derived data ----
  // Filter leads by search query and active filter simultaneously
  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter((lead) => {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    });

  // ---- CRUD handlers ----

  /**
   * Opens the modal in Create mode (no pre-filled data).
   */
  const openCreateModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the modal in Edit mode with the selected lead pre-filled.
   * @param {Object} lead - The lead to edit.
   */
  const openEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Closes the modal and resets selected lead.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  /**
   * Handles form submission for both create and update operations.
   * @param {Object} formData - The form field values from LeadForm.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // ---- UPDATE existing lead ----
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, ...formData }
            : lead
        )
      );
      toast.success(`${formData.name} updated successfully`, {
        style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #1e293b' },
        iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
      });
    } else {
      // ---- CREATE new lead ----
      const newLead = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      setLeads((prev) => [newLead, ...prev]);
      toast.success(`${formData.name} added to pipeline`, {
        style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #1e293b' },
        iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
      });
    }
    closeModal();
  };

  /**
   * Clears all search and filter criteria.
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  /**
   * Deletes a lead by id and displays a red toast notification.
   * @param {number} id - The id of the lead to remove.
   */
  const handleDelete = (id) => {
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.success(`${lead?.name || 'Lead'} removed from pipeline`, {
      style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #1e293b' },
      iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
    });
  };

  return (
    // Outer page wrapper with dark background and responsive padding
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =============================================================== */}
        {/* HEADER — Title, description, and Add Lead CTA                  */}
        {/* =============================================================== */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Lead Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Create, view, edit, and track active business leads inside your pipeline.
            </p>
          </div>
          {/* Primary CTA to open the Create Lead modal */}
          <button
            type="button"
            onClick={openCreateModal}
            id="btn-add-lead"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/35 transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Lead</span>
          </button>
        </div>

        {/* =============================================================== */}
        {/* TOOLBAR — Search, filter bar, and view toggle                   */}
        {/* =============================================================== */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-sm">
          {/* Search and filter row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search input with debouncing */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* View toggle buttons — Card / Table */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`rounded-md p-1.5 transition-colors duration-200 ${
                  viewMode === 'table'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                aria-label="Table view"
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`rounded-md p-1.5 transition-colors duration-200 ${
                  viewMode === 'card'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                aria-label="Card view"
                title="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter bar with clickable buttons */}
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            leads={leads}
          />
        </div>

        {/* =============================================================== */}
        {/* RESULTS COUNT                                                  */}
        {/* =============================================================== */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-300">{filteredLeads.length}</span> of{' '}
            <span className="font-semibold text-slate-300">{leads.length}</span> leads
          </p>
        </div>

        {/* =============================================================== */}
        {/* LEADS LIST — Conditional Card grid or Table view                */}
        {/* =============================================================== */}
        <div className="mt-4">
          {viewMode === 'card' ? (
            // Card grid — 1 col mobile, 2 col tablet, 3 col desktop
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                // Empty state for card view
                <EmptyState
                  hasFilters={searchQuery !== '' || activeFilter !== 'All'}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          ) : (
            // Table view
            <>
              {filteredLeads.length > 0 ? (
                <LeadTable
                  leads={filteredLeads}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ) : (
                // Empty state for table view
                <EmptyState
                  hasFilters={searchQuery !== '' || activeFilter !== 'All'}
                  onClearFilters={handleClearFilters}
                />
              )}
            </>
          )}
        </div>

      </div>

      {/* ================================================================= */}
      {/* MODAL OVERLAY — Create / Edit Lead Form                          */}
      {/* ================================================================= */}
      {isModalOpen && (
        // Backdrop overlay with blur
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          {/* Modal container card */}
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 id="lead-modal-title" className="text-xl font-bold text-white">
                {selectedLead ? 'Edit Lead' : 'Create New Lead'}
              </h2>
              {/* Close button */}
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Render the dual-purpose LeadForm */}
            <div className="mt-5">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
