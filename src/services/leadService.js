
import api from './api';

export const leadService = {
  getLeads: async (params) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  getLeadStats: async () => {
    const response = await api.get('/leads/stats/summary');
    return response.data;
  },

  getMonthlyStats: async () => {
    const response = await api.get('/leads/stats/monthly');
    return response.data;
  },

  searchLeads: async (q, limit = 5) => {
    const response = await api.get('/leads/search', {
      params: { q, limit }
    });
    return response.data;
  },
};
