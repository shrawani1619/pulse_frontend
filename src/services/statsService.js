import api from './api';

export const statsService = {
  getConsistency: () => api.get('/stats/consistency'),
};
