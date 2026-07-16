// Import React and useState hook for managing form field state and validation
import React, { useState } from 'react';
// Import X icon for the cancel/close button visual
import { X } from 'lucide-react';

/**
 * Ordered list of CRM lead status options.
 * @type {string[]}
 */
const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

/**
 * Ordered list of lead source / acquisition channel options.
 * @type {string[]}
 */
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * LeadForm — A dual-purpose form component that handles both CREATE and
 * EDIT workflows for CRM leads.
 *
 * When `initialData` is provided the form pre-fills all fields and switches
 * the submit button label to "Update Lead". Otherwise it renders an empty
 * form for creating a new lead.
 *
 * **Validation**: Name, Company, and Email are required. If any required
 * field is empty on submission, an inline error message is displayed below
 * the offending input.
 *
 * @component
 * @param {Object}    props              - Component props.
 * @param {Object}    [props.initialData] - Pre-populated lead data for edit mode.
 * @param {Function}  props.onSubmit      - Callback receiving the form data object on valid submission.
 * @param {Function}  props.onCancel      - Callback invoked when the user cancels/closes the form.
 * @returns {JSX.Element}                 The rendered LeadForm component.
 *
 * @example
 * // Create mode
 * <LeadForm onSubmit={handleCreate} onCancel={closeModal} />
 *
 * // Edit mode
 * <LeadForm initialData={selectedLead} onSubmit={handleUpdate} onCancel={closeModal} />
 */
export default function LeadForm({ initialData = null, onSubmit, onCancel }) {
  // Determine whether the form is in edit mode based on presence of initialData
  const isEditMode = Boolean(initialData);

  // Form field state, pre-filled from initialData or set to defaults
  const [formData, setFormData] = useState({
    name:    initialData?.name    ?? '',
    company: initialData?.company ?? '',
    email:   initialData?.email   ?? '',
    phone:   initialData?.phone   ?? '',
    status:  initialData?.status  ?? 'New',
    source:  initialData?.source  ?? 'Website',
  });

  // Validation error messages keyed by field name
  const [errors, setErrors] = useState({});

  /**
   * Generic field change handler.
   * @param {string} field - The formData key to update.
   * @returns {(e: React.ChangeEvent) => void}
   */
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field-level error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validates required fields and returns true if the form is valid.
   * @returns {boolean}
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim())   newErrors.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form submission handler — validates then delegates to onSubmit callback.
   * @param {React.FormEvent} e
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  // Shared Tailwind class string for all text inputs
  const inputBaseClass =
    'mt-1.5 block w-full rounded-xl border bg-surface  px-3.5 py-2.5 text-sm text-text-main  placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:outline-none focus:ring-1';
  const inputNormalBorder = 'border-border-main  focus:border-primary focus:ring-primary';
  const inputErrorBorder  = 'border-red-400 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500';

  return (
    // Form element — prevents default and delegates to custom handler
    <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>

      {/* ---- Name field ---- */}
      <div>
        <label htmlFor="lead-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Lead Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-name"
          type="text"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={handleChange('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'lead-name-error' : undefined}
          className={`${inputBaseClass} ${errors.name ? inputErrorBorder : inputNormalBorder}`}
        />
        {errors.name && (
          <p id="lead-name-error" className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>
        )}
      </div>

      {/* ---- Company field ---- */}
      <div>
        <label htmlFor="lead-company" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-company"
          type="text"
          placeholder="e.g. Acme Corp"
          value={formData.company}
          onChange={handleChange('company')}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'lead-company-error' : undefined}
          className={`${inputBaseClass} ${errors.company ? inputErrorBorder : inputNormalBorder}`}
        />
        {errors.company && (
          <p id="lead-company-error" className="mt-1 text-xs text-red-400" role="alert">{errors.company}</p>
        )}
      </div>

      {/* ---- Email field ---- */}
      <div>
        <label htmlFor="lead-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'lead-email-error' : undefined}
          className={`${inputBaseClass} ${errors.email ? inputErrorBorder : inputNormalBorder}`}
        />
        {errors.email && (
          <p id="lead-email-error" className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>
        )}
      </div>

      {/* ---- Phone field (optional) ---- */}
      <div>
        <label htmlFor="lead-phone" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Phone
        </label>
        <input
          id="lead-phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange('phone')}
          className={`${inputBaseClass} ${inputNormalBorder}`}
        />
      </div>

      {/* ---- Status & Source grid (2-col on sm+) ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Status dropdown */}
        <div>
          <label htmlFor="lead-status" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Status
          </label>
          <select
            id="lead-status"
            value={formData.status}
            onChange={handleChange('status')}
            className="mt-1.5 block w-full rounded-xl border border-border-main bg-surface px-3.5 py-2.5 text-sm text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface text-text-main">{s}</option>
            ))}
          </select>
        </div>

        {/* Source dropdown */}
        <div>
          <label htmlFor="lead-source" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Source
          </label>
          <select
            id="lead-source"
            value={formData.source}
            onChange={handleChange('source')}
            className="mt-1.5 block w-full rounded-xl border border-border-main bg-surface px-3.5 py-2.5 text-sm text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface text-text-main">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- Action buttons ---- */}
      <div className="mt-6 flex justify-end gap-3 border-t border-border-main pt-4">
        {/* Cancel / Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border-main bg-background px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface dark:hover:bg-surface hover:text-text-main dark:hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        {/* Submit button — label adapts to mode */}
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-primary transition-colors cursor-pointer"
        >
          {isEditMode ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
