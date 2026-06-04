import api from '../lib/api';

export const salesApi = {
  getAll: (params?: any) => api.get('/sales', { params }).then(res => res.data.data.sales),
  getById: (id: string) => api.get(`/sales/${id}`).then(res => res.data.data.sale),
  create: (data: any) => api.post('/sales', data).then(res => res.data.data.sale),
  cancel: (id: string) => api.delete(`/sales/${id}`).then(res => res.data),
};
