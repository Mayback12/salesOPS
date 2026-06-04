import api from '../lib/api';

export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }).then(res => res.data.data.products),
  getById: (id: string) => api.get(`/products/${id}`).then(res => res.data.data.product),
  create: (data: any) => api.post('/products', data).then(res => res.data.data.product),
  update: (id: string, data: any) => api.put(`/products/${id}`, data).then(res => res.data.data.product),
  delete: (id: string) => api.delete(`/products/${id}`).then(res => res.data),
  restock: (id: string, quantity: number) => api.post(`/products/${id}/restock`, { quantity }).then(res => res.data.data.product),
};
