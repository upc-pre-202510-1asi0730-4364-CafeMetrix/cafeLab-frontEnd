import api from '@/shared/config/api';

export const calibrationApi = {
  getAll: () => api.get('/calibrations'),
  getById: (id) => api.get(`/calibrations/${id}`),
  create: (data) => api.post('/calibrations', data),
  update: (id, data) => api.put(`/calibrations/${id}`, data),
  delete: (id) => api.delete(`/calibrations/${id}`)
};

export default calibrationApi; 