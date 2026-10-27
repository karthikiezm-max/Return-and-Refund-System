import { apiCall } from './api';

export const returnApi = {
  getAll: () => apiCall('/returns'),
  getById: (id) => apiCall(`/returns/${id}`),
  getByCustomer: (customerId) => apiCall(`/returns/customer/${customerId}`),
  getByOrder: (orderId) => apiCall(`/returns/order/${orderId}`),
  create: (data) => apiCall('/returns', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/returns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancel: (id) => apiCall(`/returns/${id}/cancel`, { method: 'PUT' }),
  supportOverride: (id, data) => apiCall(`/returns/${id}/support-override`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/returns/${id}`, { method: 'DELETE' })
};

export default returnApi;
