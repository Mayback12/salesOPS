import api from '../lib/api';

export const categoriesApi = {
  getAll: () => api.get('/categories').then(res => res.data.data.categories),
  create: (data: { name: string }) => api.post('/categories', data).then(res => res.data.data.category),
};
