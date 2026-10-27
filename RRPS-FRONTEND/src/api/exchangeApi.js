import { apiCall } from './api';

export const exchangeApi = {
  getAll: () => apiCall('/exchanges'),
  getById: (id) => apiCall(`/exchanges/${id}`),
  create: (data) => apiCall('/exchanges', { method: 'POST', body: JSON.stringify(data) })
};

export default exchangeApi;
