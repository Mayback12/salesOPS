import api from '../lib/api';

export const reportsApi = {
  getSummary: () => api.get('/reports/summary').then(res => res.data.data),
  getDailyChart: () => api.get('/reports/charts/daily').then(res => res.data.data),
  getBusinessReport: (params?: any) => api.get('/reports/business', { params }).then(res => res.data.data),
};
