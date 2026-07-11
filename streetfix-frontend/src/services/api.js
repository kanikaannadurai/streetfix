import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  // If the backend returns a Page object, unwrap the content for backward compatibility
  if (response.data && response.data.content && typeof response.data.totalPages === 'number') {
    response.data = response.data.content;
  }
  return response;
}, (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/unauthorized';
      }
    } else if (status === 404) {
      window.location.href = '/not-found';
    }
  }
  return Promise.reject(error);
});

export default api;
