import api from '../../shared/config/api';

export const defectApi = {
  getAll: () => api.get('/defects'),
  getById: (id) => api.get(`/defects/${id}`),
  create: (data) => api.post('/defects', data),
  update: (id, data) => api.put(`/defects/${id}`, data),
  delete: (id) => api.delete(`/defects/${id}`)
};

export default defectApi; 