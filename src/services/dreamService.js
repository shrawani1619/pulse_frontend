import api from './api';

export const dreamService = {
  getAll: () => api.get('/dreams'),
  create: (data) => api.post('/dreams', data),
  update: (id, data) => api.put(`/dreams/${id}`, data),
  delete: (id) => api.delete(`/dreams/${id}`),
};
