import api from '../lib/api';

export const expensesApi = {
  getAll: (params?: any) => api.get('/expenses', { params }).then(res => res.data.data.expenses),
  create: (data: any) => api.post('/expenses', data).then(res => res.data.data.expense),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data).then(res => res.data.data.expense),
};
