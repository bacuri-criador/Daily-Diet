import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('daily-diet-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('daily-diet-token')) {
      localStorage.removeItem('daily-diet-token');
      if (!['/login', '/cadastro'].includes(window.location.pathname)) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  return error.response?.data?.message || 'Não foi possível concluir a operação. Tente novamente.';
}
