import React, { createContext, useContext, useState, useCallback } from 'react';
import { leadService } from '../services/leadService';
import toast from 'react-hot-toast';

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads(params);
      
      // Handle both array response and paginated object response
      const fetchedLeads = Array.isArray(data)
  ? data
  : (data.leads || data.data || []);

console.log("Fetched Leads:", fetchedLeads);

setLeads(fetchedLeads);
      
      if (data.pagination) {
        setPagination(data.pagination);
      } else if (data.total) {
        setPagination({ 
          page: params.page || 1, 
          limit: params.limit || 10, 
          total: data.total 
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch leads');
      console.error('fetchLeads error', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLead = async (leadData) => {
    try {
      const newLead = await leadService.createLead(leadData);
      setLeads((prev) => [newLead, ...prev]);
      toast.success('Lead added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lead');
      throw error;
    }
  };

  const updateLead = async (id, updates) => {
    try {
      const updatedLead = await leadService.updateLead(id, updates);
      setLeads((prev) => prev.map((l) => (l.id === id || l._id === id ? updatedLead : l)));
      toast.success('Lead updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lead');
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id && l._id !== id));
      toast.success('Lead deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
      throw error;
    }
  };

  return (
    <LeadContext.Provider value={{ leads, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used inside <LeadProvider>');
  return ctx;
}
