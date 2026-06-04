import api from '../lib/api';

export const debtsApi = {
  getAll: (params?: any) => api.get('/debts', { params }).then(res => res.data.data.debts),
  recordPayment: (id: string, data: any) => api.post(`/debts/${id}/payment`, data).then(res => res.data.data),
};
