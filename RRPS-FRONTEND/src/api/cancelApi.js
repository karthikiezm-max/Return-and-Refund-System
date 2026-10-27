import { apiCall } from './api';

export const cancelApi = {
  cancelReturn: (returnId) => apiCall(`/returns/${returnId}/cancel`, { method: 'PUT' })
};

export default cancelApi;
