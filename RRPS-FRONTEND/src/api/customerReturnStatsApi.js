import { apiCall } from './api';

export const customerReturnStatsApi = {
  getAll: () => apiCall('/customer-return-stats'),
  getByCustomer: (customerId) => apiCall(`/customer-return-stats/customer/${customerId}`)
};

export default customerReturnStatsApi;
