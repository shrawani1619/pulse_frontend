import api from './api';

export const focusService = {
  getAll: (params) => api.get('/focus', { params }),
  getActive: () => api.get('/focus/active'),
  start: (data) => api.post('/focus/start', data),
  complete: (id, data) => api.post(`/focus/${id}/complete`, data),
  cancel: (id, data) => api.post(`/focus/${id}/cancel`, data),
};
