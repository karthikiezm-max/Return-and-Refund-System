import { apiCall } from './api';

export const userApi = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  create: (data) => apiCall('/users', { method: 'POST', body: JSON.stringify(data) })
};

export default userApi;
