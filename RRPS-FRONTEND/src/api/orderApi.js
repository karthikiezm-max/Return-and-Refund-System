import { apiCall } from './api';

export const orderApi = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  getByCustomer: (customerId) => apiCall(`/orders/customer/${customerId}`),
  create: (data) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) })
};

export default orderApi;
