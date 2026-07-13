import api from './api';

export const insightsService = {
  getAll: () => api.get('/insights'),
  getNudges: () => api.get('/insights/nudges'),
  getAnalytics: () => api.get('/insights/analytics'),
};
