import { apiCall } from './api';

export const analyticsApi = {
  getReturns: () => apiCall('/analytics/returns'),
  getRefundTat: () => apiCall('/analytics/refund-tat'),
  getQc: () => apiCall('/analytics/qc'),
  getFraud: () => apiCall('/analytics/fraud')
};

export default analyticsApi;
