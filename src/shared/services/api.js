import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_MOCKAPI_URL_3 || 'https://6824c1b40f0188d7e72aabca.mockapi.io/api/v1/'
});

export const cuppingSessions = {
  getAll: () => api.get('/cuppingSessions'),
  getById: (id) => api.get(`/cuppingSessions/${id}`),
  create: (data) => api.post('/cuppingSessions', data),
  update: (id, data) => api.put(`/cuppingSessions/${id}`, data),
  delete: (id) => api.delete(`/cuppingSessions/${id}`),
};

export const costosLote = {
  getAll: () => api.get('/costosLote'),
  getById: (id) => api.get(`/costosLote/${id}`),
  create: (data) => api.post('/costosLote', data),
  update: (id, data) => api.put(`/costosLote/${id}`, data),
  delete: (id) => api.delete(`/costosLote/${id}`),
};

export const movimientosInventario = {
  getAll: () => api.get('/movimientosInventario'),
  getById: (id) => api.get(`/movimientosInventario/${id}`),
  create: (data) => api.post('/movimientosInventario', data),
  update: (id, data) => api.put(`/movimientosInventario/${id}`, data),
  delete: (id) => api.delete(`/movimientosInventario/${id}`),
};

export default api; 