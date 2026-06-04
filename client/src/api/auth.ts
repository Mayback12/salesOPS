import api from '../lib/api';

export const authApi = {
  login: (data: any) => api.post('/auth/login', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data.data.user),
};
