import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  ShoppingBag,
  PlusCircle,
  Clock,
  Navigation,
  CreditCard,
  Repeat,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Users,
  Sliders,
  RotateCcw,
  MessageSquare,
  QrCode,
  CheckSquare,
  UploadCloud,
  FileCheck,
  History,
  DollarSign,
  TrendingUp,
  FileText,
  Boxes,
  Tag,
  BarChart2,
  ShieldAlert,
  Truck,
  Settings,
  Bell,
  User
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'customer';

  const customerItems = [
    { id: 'customer_home', label: 'Home', icon: Home },
    { id: 'customer_orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'customer_initiate', label: 'Initiate Return', icon: PlusCircle },
    { id: 'customer_history', label: 'Return History', icon: Clock },
    { id: 'customer_track', label: 'Track Return', icon: Navigation },
    { id: 'customer_refunds', label: 'Refund Status', icon: CreditCard },
    { id: 'customer_exchanges', label: 'Exchange Requests', icon: Repeat },
    { id: 'customer_policy', label: 'Return Policy', icon: BookOpen },
    { id: 'customer_support', label: 'Support', icon: HelpCircle },
  ];

  const supportItems = [
    { id: 'support_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'support_lookup', label: 'Customer Lookup', icon: Users },
    { id: 'support_returns', label: 'Return Requests', icon: RotateCcw },
    { id: 'support_override', label: 'Override Requests', icon: Sliders },
    { id: 'support_manual_refund', label: 'Manual Refund', icon: DollarSign },
    { id: 'support_comms', label: 'Communication Center', icon: MessageSquare },
  ];

  const qcItems = [
    { id: 'qc_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qc_pending', label: 'Pending Inspection', icon: Clock },
    { id: 'qc_scanner', label: 'Barcode Scanner UI', icon: QrCode },
    { id: 'qc_appraisal', label: 'QC Inspection Form', icon: CheckSquare },
    { id: 'qc_images', label: 'Image Upload', icon: UploadCloud },
    { id: 'qc_disposition', label: 'Disposition Decision', icon: FileCheck },
    { id: 'qc_history', label: 'Inspection History', icon: History },
  ];

  const financeItems = [
    { id: 'finance_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance_refund_queue', label: 'Refund Queue', icon: CreditCard },
    { id: 'finance_cod', label: 'COD Refund', icon: DollarSign },
    { id: 'finance_transfers', label: 'Bank Transfers', icon: TrendingUp },
    { id: 'finance_reports', label: 'Refund Reports', icon: FileText },
    { id: 'finance_liability', label: 'Liability Report', icon: BarChart2 },
  ];

  const supplierItems = [
    { id: 'supplier_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'supplier_rtm', label: 'RTM Batches', icon: Boxes },
    { id: 'supplier_credit_notes', label: 'Credit Notes', icon: Tag },
    { id: 'supplier_returns', label: 'Supplier Returns', icon: RotateCcw },
    { id: 'supplier_analytics', label: 'Supplier Analytics', icon: BarChart2 },
  ];

  const adminItems = [
    { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_policies', label: 'Return Policies', icon: BookOpen },
    { id: 'admin_refund_rules', label: 'Refund Rules', icon: CreditCard },
    { id: 'admin_fraud', label: 'Fraud Queue', icon: ShieldAlert },
    { id: 'admin_analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'admin_reports', label: 'Reports', icon: FileText },
    { id: 'admin_logistics', label: 'Logistics Partners', icon: Truck },
    { id: 'admin_settings', label: 'System Settings', icon: Settings },
  ];

  const roleConfigs = {
    customer: { label: 'CUSTOMER ROLE', items: customerItems },
    customer_support: { label: 'CUSTOMER SUPPORT ROLE', items: supportItems },
    warehouse_qc: { label: 'WAREHOUSE QC ROLE', items: qcItems },
    finance: { label: 'FINANCE ROLE', items: financeItems },
    supplier_manager: { label: 'SUPPLIER MANAGER ROLE', items: supplierItems },
    admin: { label: 'SYSTEM ADMIN', items: adminItems }
  };

  const currentConfig = roleConfigs[role] || roleConfigs.customer;

  return (
    <aside className="sidebar">
      <div className="sidebar-role-label">{currentConfig.label}</div>

      <nav className="sidebar-nav-list">
        {currentConfig.items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-role-label" style={{ paddingTop: 0 }}>COMMON</div>
      <div className="sidebar-nav-list">
        <button
          className={`sidebar-nav-item ${activeTab === 'common_profile' ? 'active' : ''}`}
          onClick={() => onSelectTab('common_profile')}
        >
          <User size={16} />
          <span>Profile</span>
        </button>
        <button
          className={`sidebar-nav-item ${activeTab === 'common_settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('common_settings')}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          className={`sidebar-nav-item ${activeTab === 'common_notifications' ? 'active' : ''}`}
          onClick={() => onSelectTab('common_notifications')}
        >
          <Bell size={16} />
          <span>Notifications</span>
        </button>
      </div>

      <div className="sidebar-user-card">
        <div className="user-card-avatar">
          {currentUser?.avatar || currentUser?.name?.[0] || 'U'}
        </div>
        <div className="user-card-details">
          <span className="user-card-name">{currentUser?.name || 'User'}</span>
          <span className="user-card-role">{currentUser?.role?.replace('_', ' ') || 'Guest'}</span>
        </div>
      </div>
    </aside>
  );
};
