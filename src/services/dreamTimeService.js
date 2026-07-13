import api from './api';

export const dreamTimeService = {
  getAll: (params) => api.get('/dream-time', { params }),
  create: (data) => api.post('/dream-time', data),
  update: (id, data) => api.put(`/dream-time/${id}`, data),
  delete: (id) => api.delete(`/dream-time/${id}`),
};
