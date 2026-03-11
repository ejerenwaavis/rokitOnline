import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rokit_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — only clear stored credentials, never force-redirect
// (a hard redirect would kick unauthenticated users off public pages)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rokit_token');
      localStorage.removeItem('rokit_user');
    }
    return Promise.reject(err);
  }
);

export default api;
