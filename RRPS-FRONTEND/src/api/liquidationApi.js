import { apiCall } from './api';

export const liquidationApi = {
  getAll: () => apiCall('/liquidation-batches'),
  create: (data) => apiCall('/liquidation-batches', { method: 'POST', body: JSON.stringify(data) })
};

export default liquidationApi;
