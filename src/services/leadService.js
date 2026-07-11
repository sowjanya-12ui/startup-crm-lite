import api from './api';

export const leadService = {
  /**
   * Get leads with optional pagination, search, and status filters
   * @param {object} params - e.g., { status: 'New', search: 'John', page: 1, limit: 10 }
   */
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  /**
   * Create a new lead
   * @param {object} leadData 
   */
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  /**
   * Update an existing lead completely
   * @param {string} id 
   * @param {object} leadData 
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Update only the status of a lead
   * @param {string} id 
   * @param {string} status 
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a lead
   * @param {string} id 
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Get summary statistics for leads
   */
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats/summary');
    return response.data;
  },

  /**
   * Get monthly statistics for leads (last 6 months)
   */
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/stats/monthly');
    return response.data;
  },

  /**
   * Quick autocomplete search
   * @param {string} q - search term
   * @param {number} [limit=5] - max results
   */
  searchLeads: async (q, limit = 5) => {
    const response = await api.get('/api/leads/search', { params: { q, limit } });
    return response.data;
  },
};
