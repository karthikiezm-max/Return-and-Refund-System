const BASE_URL = 'http://localhost:8080/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('rrps_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const ensureToken = async () => {
  let token = localStorage.getItem('rrps_token');
  if (!token) {
    try {
      const userStr = localStorage.getItem('rrps_user');
      const email = userStr ? JSON.parse(userStr).email : 'karthik@enterprise.com';
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password' })
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        if (loginData.token) {
          token = loginData.token;
          localStorage.setItem('rrps_token', token);
        }
      }
    } catch (e) {
      console.warn('Auto-login token fetch failed:', e);
    }
  }
  return token;
};

export const apiCall = async (endpoint, options = {}) => {
  try {
    if (!endpoint.includes('/auth/login')) {
      await ensureToken();
    }

    let res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      }
    });

    if ((res.status === 401 || res.status === 403) && !endpoint.includes('/auth/login')) {
      console.warn(`[API Auth Refresh] Got ${res.status} for ${endpoint}. Refreshing JWT token...`);
      localStorage.removeItem('rrps_token');
      const newToken = await ensureToken();
      if (newToken) {
        res = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
            ...options.headers
          }
        });
      }
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch (err) {
    console.warn(`[API Call Warning] ${endpoint}:`, err.message);
    throw err;
  }
};

export const authApi = {
  login: async (email, password) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
};

export const orderApi = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  getByCustomer: (customerId) => apiCall(`/orders/customer/${customerId}`)
};

export const returnApi = {
  getAll: () => apiCall('/returns'),
  getById: (id) => apiCall(`/returns/${id}`),
  getByCustomer: (customerId) => apiCall(`/returns/customer/${customerId}`),
  create: (data) => apiCall('/returns', { method: 'POST', body: JSON.stringify(data) }),
  cancel: (id) => apiCall(`/returns/${id}/cancel`, { method: 'PUT' }),
  supportOverride: (id, data) => apiCall(`/returns/${id}/support-override`, { method: 'PUT', body: JSON.stringify(data) })
};

export const qcApi = {
  submitInspection: (data) => apiCall('/qc', { method: 'POST', body: JSON.stringify(data) }),
  getInspections: () => apiCall('/qc')
};

export const refundApi = {
  getAll: () => apiCall('/refunds'),
  getById: (id) => apiCall(`/refunds/${id}`),
  disburse: (id) => apiCall(`/refunds/${id}/disburse`, { method: 'POST' })
};

export const pickupApi = {
  getAll: () => apiCall('/pickups'),
  reschedule: (id, data) => apiCall(`/pickups/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) })
};

export const fraudApi = {
  getQueue: () => apiCall('/returns/fraud-queue'),
  updateFlag: (id, data) => apiCall(`/fraud/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};

export const rtmApi = {
  getAll: () => apiCall('/rtm'),
  createBatch: (data) => apiCall('/rtm', { method: 'POST', body: JSON.stringify(data) }),
  dispatchBatch: (id) => apiCall(`/rtm/${id}/dispatch`, { method: 'PUT' })
};

export const policyApi = {
  getAll: () => apiCall('/return-policies'),
  update: (id, data) => apiCall(`/return-policies/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};
