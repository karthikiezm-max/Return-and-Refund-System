import { apiCall } from './api';

export const communicationApi = {
  getAll: () => apiCall('/communications'),
  send: (data) => apiCall('/communications', { method: 'POST', body: JSON.stringify(data) })
};

export default communicationApi;
