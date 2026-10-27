import { apiCall } from './api';

export const qcApi = {
  getAll: () => apiCall('/qc'),
  getById: (id) => apiCall(`/qc/${id}`),
  getByReturnId: (returnId) => apiCall(`/qc/return/${returnId}`),
  submitInspection: (data) => apiCall('/qc', { method: 'POST', body: JSON.stringify(data) })
};

export default qcApi;
