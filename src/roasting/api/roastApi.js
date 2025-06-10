import api from '@/shared/config/api';

export const roastApi = {
  getAll: () => api.get('/roasts'),
  getById: (id) => api.get(`/roasts/${id}`),
  create: (data) => api.post('/roasts', data),
  update: (id, data) => api.put(`/roasts/${id}`, data),
  delete: (id) => api.delete(`/roasts/${id}`)
};

export default roastApi; 