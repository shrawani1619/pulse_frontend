import api from './api';

export const actionService = {
  getAll: (params) => api.get('/actions', { params }),
  create: (data) => api.post('/actions', data),
  update: (id, data) => api.put(`/actions/${id}`, data),
  delete: (id) => api.delete(`/actions/${id}`),
};
