import { apiCall } from './api';

export const orderItemApi = {
  getAll: () => apiCall('/order-items'),
  getByOrder: (orderId) => apiCall(`/order-items/order/${orderId}`)
};

export default orderItemApi;
