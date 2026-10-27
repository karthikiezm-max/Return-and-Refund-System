import { apiCall } from './api';

export const supplierApi = {
  getAll: () => apiCall('/suppliers'),
  getById: (id) => apiCall(`/suppliers/${id}`),
  create: (data) => apiCall('/suppliers', { method: 'POST', body: JSON.stringify(data) })
};

export default supplierApi;
