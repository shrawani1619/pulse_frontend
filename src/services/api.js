import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pulse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Wrong API URL (e.g. pointing at Vercel) returns index.html as the "response"
    const data = res.data;
    if (typeof data === 'string' && data.includes('<!doctype html')) {
      return Promise.reject(
        new Error(
          'API returned HTML instead of JSON. Set REACT_APP_API_URL to https://pulse-backend-tkpf.onrender.com/api/v1 on Vercel and redeploy.'
        )
      );
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('pulse_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
