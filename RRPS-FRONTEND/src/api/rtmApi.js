import { apiCall } from './api';

export const rtmApi = {
  getAll: () => apiCall('/rtm'),
  getById: (id) => apiCall(`/rtm/${id}`),
  createBatch: (data) => apiCall('/rtm', { method: 'POST', body: JSON.stringify(data) }),
  dispatchBatch: (id) => apiCall(`/rtm/${id}/dispatch`, { method: 'PUT' }),
  updateStatus: (id, status) => apiCall(`/rtm/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};

export default rtmApi;
