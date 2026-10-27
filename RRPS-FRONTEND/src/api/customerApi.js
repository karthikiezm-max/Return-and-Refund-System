import { apiCall } from './api';

export const customerApi = {
  getAll: () => apiCall('/customers'),
  getById: (id) => apiCall(`/customers/${id}`),
  create: (data) => apiCall('/customers', { method: 'POST', body: JSON.stringify(data) })
};

export default customerApi;
