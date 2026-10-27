import { apiCall } from './api';

export const refundApi = {
  getAll: () => apiCall('/refunds'),
  getById: (id) => apiCall(`/refunds/${id}`),
  getByReturnId: (returnId) => apiCall(`/refunds/return/${returnId}`),
  create: (data) => apiCall('/refunds', { method: 'POST', body: JSON.stringify(data) }),
  disburse: (id) => apiCall(`/refunds/${id}/disburse`, { method: 'POST' }),
  updateStatus: (id, data) => apiCall(`/refunds/${id}/status`, { method: 'PUT', body: JSON.stringify(data) })
};

export default refundApi;
