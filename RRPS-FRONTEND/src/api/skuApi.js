import { apiCall } from './api';

export const skuApi = {
  getAll: () => apiCall('/skus'),
  getById: (id) => apiCall(`/skus/${id}`),
  getByCode: (code) => apiCall(`/skus/code/${code}`)
};

export default skuApi;
