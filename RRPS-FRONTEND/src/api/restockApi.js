import { apiCall } from './api';

export const restockApi = {
  getAll: () => apiCall('/restocked-items'),
  create: (data) => apiCall('/restocked-items', { method: 'POST', body: JSON.stringify(data) })
};

export default restockApi;
