/* eslint-disable react-refresh/only-export-components -- provider + hook live together by design */
// React primitives for building the leads context provider and hook
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * Seed leads dataset — the single source of truth shared by Lead Management
 * and Analytics. `createdAt` is an ISO timestamp (used by analytics charts);
 * `date` is the YYYY-MM-DD display value used by the lead table/cards.
 * Dates are spread across the last six months so the charts are meaningful.
 * @type {Array<Object>}
 */
const initialLeads = [
  { id: 1,  name: 'Sarah Connor',     company: 'Cyberdyne Systems', email: 'sarah@cyberdyne.co',    phone: '+1 555-0101', status: 'Proposal Sent',     source: 'LinkedIn',       createdAt: '2026-06-15T09:00:00.000Z', date: '2026-06-15' },
  { id: 2,  name: 'Bruce Wayne',      company: 'Wayne Enterprises', email: 'bruce@wayne.co',        phone: '+1 555-0102', status: 'Contacted',         source: 'Referral',       createdAt: '2026-06-14T09:00:00.000Z', date: '2026-06-14' },
  { id: 3,  name: 'Tony Stark',       company: 'Stark Industries',  email: 'tony@stark.co',         phone: '+1 555-0103', status: 'Won',               source: 'Website',        createdAt: '2026-06-12T09:00:00.000Z', date: '2026-06-12' },
  { id: 4,  name: 'Clark Kent',       company: 'Daily Planet',      email: 'clark@dailyplanet.co',  phone: '',            status: 'New',               source: 'Cold Call',      createdAt: '2026-06-06T09:00:00.000Z', date: '2026-06-06' },
  { id: 5,  name: 'Selina Kyle',      company: 'Gotham Jewels',     email: 'selina@kyle.co',        phone: '+1 555-0105', status: 'Lost',              source: 'Email Campaign', createdAt: '2026-05-28T09:00:00.000Z', date: '2026-05-28' },
  { id: 6,  name: 'Barry Allen',      company: 'S.T.A.R. Labs',     email: 'barry@starlabs.co',     phone: '+1 555-0106', status: 'Meeting Scheduled', source: 'Referral',       createdAt: '2026-05-20T09:00:00.000Z', date: '2026-05-20' },
  { id: 7,  name: 'Diana Prince',     company: 'Themyscira Corp',   email: 'diana@themyscira.co',   phone: '+1 555-0107', status: 'Won',               source: 'LinkedIn',       createdAt: '2026-05-12T09:00:00.000Z', date: '2026-05-12' },
  { id: 8,  name: 'Peter Parker',     company: 'Parker Labs',       email: 'peter@parkerlabs.co',   phone: '',            status: 'New',               source: 'Website',        createdAt: '2026-05-05T09:00:00.000Z', date: '2026-05-05' },
  { id: 9,  name: 'Natasha Romanoff', company: 'Red Room Inc',      email: 'nat@redroom.co',        phone: '+1 555-0109', status: 'Proposal Sent',     source: 'Referral',       createdAt: '2026-04-22T09:00:00.000Z', date: '2026-04-22' },
  { id: 10, name: 'Steve Rogers',     company: 'Shield Global',     email: 'steve@shield.co',       phone: '+1 555-0110', status: 'Won',               source: 'Website',        createdAt: '2026-04-15T09:00:00.000Z', date: '2026-04-15' },
  { id: 11, name: 'Wanda Maximoff',   company: 'Hex Corp',          email: 'wanda@hex.co',          phone: '+1 555-0111', status: 'Lost',              source: 'Cold Call',      createdAt: '2026-04-08T09:00:00.000Z', date: '2026-04-08' },
  { id: 12, name: 'Stephen Strange',  company: 'Kamar-Taj',         email: 'strange@kamar.co',      phone: '+1 555-0112', status: 'Contacted',         source: 'LinkedIn',       createdAt: '2026-03-25T09:00:00.000Z', date: '2026-03-25' },
  { id: 13, name: 'Scott Lang',       company: 'Pym Technologies',  email: 'scott@pym.co',          phone: '',            status: 'Won',               source: 'Referral',       createdAt: '2026-03-18T09:00:00.000Z', date: '2026-03-18' },
  { id: 14, name: 'Carol Danvers',    company: 'Hala Industries',   email: 'carol@hala.co',         phone: '+1 555-0114', status: 'New',               source: 'Website',        createdAt: '2026-03-10T09:00:00.000Z', date: '2026-03-10' },
  { id: 15, name: 'Bruce Banner',     company: 'Gamma Labs',        email: 'banner@gamma.co',       phone: '+1 555-0115', status: 'Meeting Scheduled', source: 'Email Campaign', createdAt: '2026-02-26T09:00:00.000Z', date: '2026-02-26' },
  { id: 16, name: 'Thor Odinson',     company: 'Asgard Holdings',   email: 'thor@asgard.co',        phone: '+1 555-0116', status: 'Won',               source: 'Referral',       createdAt: '2026-02-14T09:00:00.000Z', date: '2026-02-14' },
  { id: 17, name: 'Loki Laufeyson',   company: 'TVA Inc',           email: 'loki@tva.co',           phone: '',            status: 'Lost',              source: 'Cold Call',      createdAt: '2026-02-05T09:00:00.000Z', date: '2026-02-05' },
  { id: 18, name: 'Nick Fury',        company: 'S.H.I.E.L.D.',      email: 'fury@shield.co',        phone: '+1 555-0118', status: 'Proposal Sent',     source: 'LinkedIn',       createdAt: '2026-01-22T09:00:00.000Z', date: '2026-01-22' },
  { id: 19, name: 'Pepper Potts',     company: 'Stark Industries',  email: 'pepper@stark.co',       phone: '+1 555-0119', status: 'Won',               source: 'Website',        createdAt: '2026-01-15T09:00:00.000Z', date: '2026-01-15' },
  { id: 20, name: 'Happy Hogan',      company: 'Stark Industries',  email: 'happy@stark.co',        phone: '+1 555-0120', status: 'New',               source: 'Referral',       createdAt: '2026-01-08T09:00:00.000Z', date: '2026-01-08' },
];

/**
 * Context holding the shared leads array and CRUD helpers.
 * @type {React.Context<null | {
 *   leads: Array<Object>,
 *   addLead: (lead: Object) => void,
 *   updateLead: (id: number, updates: Object) => void,
 *   deleteLead: (id: number) => void,
 * }>}
 */
const LeadsContext = createContext(null);

/**
 * LeadsProvider — wraps the app and exposes the shared leads state.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState(initialLeads);

  // Prepend a new lead, stamping both createdAt (ISO) and date (YYYY-MM-DD).
  const addLead = useCallback((lead) => {
    const now = new Date();
    const newLead = {
      id: Date.now(),
      ...lead,
      createdAt: now.toISOString(),
      date: now.toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
  }, []);

  // Merge updates into the lead matching the given id.
  const updateLead = useCallback((id, updates) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)),
    );
  }, []);

  // Remove the lead matching the given id.
  const deleteLead = useCallback((id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  const value = useMemo(
    () => ({ leads, addLead, updateLead, deleteLead }),
    [leads, addLead, updateLead, deleteLead],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

/**
 * useLeads — access the shared leads state and CRUD helpers.
 * @returns {{
 *   leads: Array<Object>,
 *   addLead: (lead: Object) => void,
 *   updateLead: (id: number, updates: Object) => void,
 *   deleteLead: (id: number) => void,
 * }}
 */
export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === null) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}
