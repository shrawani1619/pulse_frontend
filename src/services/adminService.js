import api from './api';

export const getAdminStats = () => api.get('/admin/stats');

export const getAdminUsers = (params = {}) => api.get('/admin/users', { params });

export const getAdminUser = (id) => api.get(`/admin/users/${id}`);

export const banUser = (id) => api.patch(`/admin/users/${id}/ban`);

export const unbanUser = (id) => api.patch(`/admin/users/${id}/unban`);

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getAdminDreams = (params = {}) => api.get('/admin/dreams', { params });

export const getAdminLogs = (params = {}) => api.get('/admin/logs', { params });
