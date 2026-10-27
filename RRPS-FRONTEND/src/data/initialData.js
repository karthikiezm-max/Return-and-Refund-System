// Seed data directly reflecting the SRS specifications, ER tables, and Postman API contract

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Karthik',
    email: 'karthik@enterprise.com',
    role: 'customer',
    customerId: 'CUST-4410',
    avatar: 'K',
    address: '406 Tech Blvd, San Francisco, CA'
  },
  {
    id: 2,
    name: 'Sarah Support',
    email: 'support@enterprise.com',
    role: 'customer_support',
    avatar: 'CS',
    department: 'L2 Operations'
  },
  {
    id: 3,
    name: 'Alex Warehouse Tech',
    email: 'qc@enterprise.com',
    role: 'warehouse_qc',
    inspectorId: 'USR-QC-12',
    avatar: 'QC',
    station: 'Bay 4 - Electronics'
  },
  {
    id: 4,
    name: 'Sarah Accountant',
    email: 'finance@enterprise.com',
    role: 'finance',
    avatar: 'FA',
    department: 'Treasury & Disbursements'
  },
  {
    id: 5,
    name: 'Frank Supplier Rel',
    email: 'supplier@enterprise.com',
    role: 'supplier_manager',
    avatar: 'SM',
    supplierId: 'SUP-ELCO-19'
  },
  {
    id: 6,
    name: 'System Administrator',
    email: 'admin@enterprise.com',
    role: 'admin',
    avatar: 'SA',
    department: 'Platform Governance'
  }
];

export const INITIAL_ORDERS = [];
export const INITIAL_RETURN_REQUESTS = [];
export const INITIAL_RETURN_ITEMS = [];
export const INITIAL_PICKUPS = [];
export const INITIAL_QC_INSPECTIONS = [];
export const INITIAL_REFUNDS = [];
export const INITIAL_FRAUD_FLAGS = [];
export const INITIAL_RTM_BATCHES = [];
export const INITIAL_POLICIES = [];
export const INITIAL_NOTIFICATIONS = [];
