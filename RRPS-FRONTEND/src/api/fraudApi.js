import { apiCall } from './api';

export const fraudApi = {
  getAll: () => apiCall('/fraud-flags'),
  getQueue: () => apiCall('/returns/fraud-queue'),
  getById: (id) => apiCall(`/fraud-flags/${id}`),
  createFlag: (data) => apiCall('/fraud-flags', { method: 'POST', body: JSON.stringify(data) }),
  updateFlag: (id, data) => apiCall(`/fraud-flags/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};

export default fraudApi;
