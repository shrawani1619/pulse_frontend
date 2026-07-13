import api from './api';

export const milestoneService = {
  getAll: (params) => api.get('/milestones', { params }),
  create: (data) => api.post('/milestones', data),
  update: (id, data) => api.put(`/milestones/${id}`, data),
  delete: (id) => api.delete(`/milestones/${id}`),
};
