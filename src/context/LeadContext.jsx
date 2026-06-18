import React, { createContext, useContext, useState } from 'react';

/**
 * LeadContext — Global React context that provides leads state
 * across the application, primarily consumed by useAnalytics.
 */
const LeadContext = createContext(null);

/**
 * Initial sample leads dataset for the CRM.
 * These leads drive all analytics computations.
 */
const initialLeads = [
  {
    id: 'lead_001', name: 'Sarah Connor', company: 'Cyberdyne Systems',
    email: 'sarah@cyberdyne.co', phone: '+1 555-0101',
    status: 'Won', source: 'LinkedIn', value: 42000,
    createdAt: '2026-01-10T10:00:00Z', contactedAt: '2026-01-11T10:00:00Z',
    meetingAt: '2026-01-14T15:00:00Z', proposalAt: '2026-01-18T10:00:00Z',
    wonAt: '2026-01-25T12:00:00Z', owner: 'Sarah',
  },
  {
    id: 'lead_002', name: 'Bruce Wayne', company: 'Wayne Enterprises',
    email: 'bruce@wayne.co', phone: '+1 555-0102',
    status: 'Contacted', source: 'Referral', value: 25000,
    createdAt: '2026-02-01T10:00:00Z', contactedAt: '2026-02-03T10:00:00Z',
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'Alex',
  },
  {
    id: 'lead_003', name: 'Tony Stark', company: 'Stark Industries',
    email: 'tony@stark.co', phone: '+1 555-0103',
    status: 'Won', source: 'Website', value: 75000,
    createdAt: '2026-02-05T10:00:00Z', contactedAt: '2026-02-06T10:00:00Z',
    meetingAt: '2026-02-10T15:00:00Z', proposalAt: '2026-02-15T10:00:00Z',
    wonAt: '2026-02-22T12:00:00Z', owner: 'Sarah',
  },
  {
    id: 'lead_004', name: 'Clark Kent', company: 'Daily Planet',
    email: 'clark@dailyplanet.co', phone: '',
    status: 'New', source: 'Cold Email', value: 8000,
    createdAt: '2026-03-01T10:00:00Z', contactedAt: null,
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'David',
  },
  {
    id: 'lead_005', name: 'Selina Kyle', company: 'Gotham Jewels',
    email: 'selina@gotham.co', phone: '+1 555-0105',
    status: 'Lost', source: 'Instagram', value: 15000,
    createdAt: '2026-03-05T10:00:00Z', contactedAt: '2026-03-07T10:00:00Z',
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'Alex',
  },
  {
    id: 'lead_006', name: 'Barry Allen', company: 'S.T.A.R. Labs',
    email: 'barry@starlabs.co', phone: '+1 555-0106',
    status: 'Meeting', source: 'Referral', value: 32000,
    createdAt: '2026-03-12T10:00:00Z', contactedAt: '2026-03-14T10:00:00Z',
    meetingAt: '2026-03-18T15:00:00Z', proposalAt: null, wonAt: null, owner: 'Sarah',
  },
  {
    id: 'lead_007', name: 'Diana Prince', company: 'Themyscira Corp',
    email: 'diana@themyscira.co', phone: '+1 555-0107',
    status: 'Proposal', source: 'LinkedIn', value: 58000,
    createdAt: '2026-03-20T10:00:00Z', contactedAt: '2026-03-21T10:00:00Z',
    meetingAt: '2026-03-24T15:00:00Z', proposalAt: '2026-03-28T10:00:00Z',
    wonAt: null, owner: 'David',
  },
  {
    id: 'lead_008', name: 'Peter Parker', company: 'Parker Labs',
    email: 'peter@parkerlabs.co', phone: '',
    status: 'Won', source: 'Website', value: 18000,
    createdAt: '2026-04-01T10:00:00Z', contactedAt: '2026-04-02T10:00:00Z',
    meetingAt: '2026-04-05T15:00:00Z', proposalAt: '2026-04-08T10:00:00Z',
    wonAt: '2026-04-15T12:00:00Z', owner: 'Alex',
  },
  {
    id: 'lead_009', name: 'Natasha Romanoff', company: 'Red Room Inc',
    email: 'natasha@redroom.co', phone: '+1 555-0109',
    status: 'Won', source: 'Referral', value: 62000,
    createdAt: '2026-04-10T10:00:00Z', contactedAt: '2026-04-11T10:00:00Z',
    meetingAt: '2026-04-15T15:00:00Z', proposalAt: '2026-04-20T10:00:00Z',
    wonAt: '2026-04-27T12:00:00Z', owner: 'Sarah',
  },
  {
    id: 'lead_010', name: 'Steve Rogers', company: 'Shield Global',
    email: 'steve@shieldglobal.co', phone: '+1 555-0110',
    status: 'Contacted', source: 'Ads', value: 20000,
    createdAt: '2026-04-15T10:00:00Z', contactedAt: '2026-04-17T10:00:00Z',
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'David',
  },
  {
    id: 'lead_011', name: 'Wanda Maximoff', company: 'Hex Corp',
    email: 'wanda@hexcorp.co', phone: '+1 555-0111',
    status: 'New', source: 'Instagram', value: 11000,
    createdAt: '2026-05-01T10:00:00Z', contactedAt: null,
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'Alex',
  },
  {
    id: 'lead_012', name: 'Thor Odinson', company: 'Asgard Ventures',
    email: 'thor@asgard.co', phone: '+1 555-0112',
    status: 'Won', source: 'LinkedIn', value: 95000,
    createdAt: '2026-05-05T10:00:00Z', contactedAt: '2026-05-06T10:00:00Z',
    meetingAt: '2026-05-10T15:00:00Z', proposalAt: '2026-05-15T10:00:00Z',
    wonAt: '2026-05-22T12:00:00Z', owner: 'Sarah',
  },
  {
    id: 'lead_013', name: 'Loki Laufeyson', company: 'Trickster Tech',
    email: 'loki@trickster.co', phone: '+1 555-0113',
    status: 'Lost', source: 'Cold Email', value: 9000,
    createdAt: '2026-05-08T10:00:00Z', contactedAt: '2026-05-10T10:00:00Z',
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'David',
  },
  {
    id: 'lead_014', name: 'Nick Fury', company: 'Shield HQ',
    email: 'fury@shield.co', phone: '+1 555-0114',
    status: 'Proposal', source: 'Referral', value: 85000,
    createdAt: '2026-05-15T10:00:00Z', contactedAt: '2026-05-16T10:00:00Z',
    meetingAt: '2026-05-20T15:00:00Z', proposalAt: '2026-05-25T10:00:00Z',
    wonAt: null, owner: 'Alex',
  },
  {
    id: 'lead_015', name: 'Carol Danvers', company: 'Starforce Corp',
    email: 'carol@starforce.co', phone: '+1 555-0115',
    status: 'New', source: 'Website', value: 27000,
    createdAt: '2026-06-01T10:00:00Z', contactedAt: null,
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'Sarah',
  },
  {
    id: 'lead_016', name: 'Sam Wilson', company: 'Wings Logistics',
    email: 'sam@wings.co', phone: '+1 555-0116',
    status: 'Contacted', source: 'LinkedIn', value: 14000,
    createdAt: '2026-06-05T10:00:00Z', contactedAt: '2026-06-07T10:00:00Z',
    meetingAt: null, proposalAt: null, wonAt: null, owner: 'David',
  },
  {
    id: 'lead_017', name: 'Rhodey Rhodes', company: 'War Machine LLC',
    email: 'rhodey@warmachine.co', phone: '+1 555-0117',
    status: 'Won', source: 'Referral', value: 45000,
    createdAt: '2026-06-08T10:00:00Z', contactedAt: '2026-06-09T10:00:00Z',
    meetingAt: '2026-06-11T15:00:00Z', proposalAt: '2026-06-13T10:00:00Z',
    wonAt: '2026-06-16T12:00:00Z', owner: 'Alex',
  },
  {
    id: 'lead_018', name: 'Scott Lang', company: 'Ant Tech',
    email: 'scott@anttech.co', phone: '+1 555-0118',
    status: 'Meeting', source: 'Ads', value: 19000,
    createdAt: '2026-06-10T10:00:00Z', contactedAt: '2026-06-11T10:00:00Z',
    meetingAt: '2026-06-14T15:00:00Z', proposalAt: null, wonAt: null, owner: 'Sarah',
  },
];

/**
 * LeadProvider — Wraps the application tree and exposes leads state.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(initialLeads);

  const addLead = (lead) => {
    setLeads((prev) => [{ id: `lead_${Date.now()}`, ...lead }, ...prev]);
  };

  const updateLead = (id, updates) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * useLeads — Hook to consume the LeadContext.
 * @returns {{ leads: Array, addLead: Function, updateLead: Function, deleteLead: Function }}
 */
export function useLeads() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used inside <LeadProvider>');
  return ctx;
}
