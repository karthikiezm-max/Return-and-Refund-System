import { apiCall } from './api';

export const pickupApi = {
  getAll: () => apiCall('/pickups'),
  getById: (id) => apiCall(`/pickups/${id}`),
  getByReturnId: (returnId) => apiCall(`/pickups/return/${returnId}`),
  create: (data) => apiCall('/pickups', { method: 'POST', body: JSON.stringify(data) }),
  reschedule: (id, data) => apiCall(`/pickups/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiCall(`/pickups/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};

export default pickupApi;
