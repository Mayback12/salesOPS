import api from '../lib/api';

export const customersApi = {
  getAll: (params?: any) => api.get('/customers', { params }).then(res => res.data.data.customers),
  getById: (id: string) => api.get(`/customers/${id}`).then(res => res.data.data.customer),
  create: (data: any) => api.post('/customers', data).then(res => res.data.data.customer),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data).then(res => res.data.data.customer),
};
