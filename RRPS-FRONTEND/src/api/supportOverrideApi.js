import { apiCall } from './api';

export const supportOverrideApi = {
  getAll: () => apiCall('/support-overrides'),
  execute: (id, data) => apiCall(`/returns/${id}/support-override`, { method: 'PUT', body: JSON.stringify(data) })
};

export default supportOverrideApi;
