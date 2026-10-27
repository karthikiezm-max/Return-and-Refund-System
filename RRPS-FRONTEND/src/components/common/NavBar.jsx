import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bell,
  ChevronDown,
  User,
  LogOut,
  RefreshCw,
  Sliders,
  CheckCircle,
  Package,
  Layers
} from 'lucide-react';
import './NavBar.css';

export const NavBar = ({ currentSection = 'Dashboard', onOpenNotifs }) => {
  const { currentUser, switchRole, logout } = useAuth();
  const { returnRequests, notifications } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const roleLabels = {
    customer: 'Customer View',
    customer_support: 'Customer Support',
    warehouse_qc: 'Warehouse QC',
    finance: 'Finance Desk',
    supplier_manager: 'Supplier Manager',
    admin: 'System Admin'
  };

  const roleOptions = [
    { role: 'customer', title: 'Customer Portal', desc: 'Returns, tracking & status' },
    { role: 'customer_support', title: 'Customer Support', desc: 'Support desk & overrides' },
    { role: 'warehouse_qc', title: 'Warehouse QC Staff', desc: 'Appraisal & scanning' },
    { role: 'finance', title: 'Finance Manager', desc: 'Refunds queue & payouts' },
    { role: 'supplier_manager', title: 'Supplier Manager', desc: 'RTM batches & credit notes' },
    { role: 'admin', title: 'System Administrator', desc: 'Fraud queue, policies & reports' }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar" ref={dropdownRef}>
      {/* Left branding & Breadcrumbs */}
      <div className="navbar-left">
        <div className="navbar-brand-link">
          <div className="navbar-brand-icon">
            <ShieldCheck size={20} />
          </div>
          <span>RETRIEVE</span>
        </div>

        <div className="navbar-breadcrumbs">
          <span>Home</span>
          <span className="breadcrumb-separator">/</span>
          <span>{roleLabels[currentUser?.role] || 'Portal'}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentSection}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="navbar-right">
        {/* Role Passport Switcher */}
        <div className="role-passport-container">
          <button
            className="role-passport-trigger"
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowProfileDropdown(false);
            }}
            title="Switch operational role passport"
          >
            <Layers size={14} />
            <span>{roleLabels[currentUser?.role] || 'Select Role'}</span>
            <ChevronDown size={14} />
          </button>

          {showRoleDropdown && (
            <div className="role-passport-dropdown">
              <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Operational Role Passport
              </div>
              {roleOptions.map((opt) => (
                <button
                  key={opt.role}
                  className={`role-passport-option ${currentUser?.role === opt.role ? 'active' : ''}`}
                  onClick={() => {
                    switchRole(opt.role);
                    setShowRoleDropdown(false);
                  }}
                >
                  <span className="role-option-title">{opt.title}</span>
                  <span className="role-option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Returns Badge */}
        <div className="badge badge-blue" style={{ fontSize: '0.75rem', gap: '6px' }}>
          <Package size={13} />
          <span>Active Returns: {returnRequests.length}</span>
        </div>

        {/* Notifications Bell */}
        <button
          className="nav-icon-btn"
          onClick={onOpenNotifs}
          title="Milestone communications & SMS notifications"
        >
          <Bell size={17} />
          {unreadNotifs > 0 && <span className="nav-badge-count">{unreadNotifs}</span>}
        </button>

        {/* User profile */}
        <div className="role-passport-container">
          <div
            className="nav-user-profile"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowRoleDropdown(false);
            }}
          >
            <div className="nav-user-avatar">
              {currentUser?.avatar || currentUser?.name?.[0] || 'U'}
            </div>
            <span className="nav-user-name">{currentUser?.name || 'User'}</span>
            <ChevronDown size={14} color="#94a3b8" />
          </div>

          {showProfileDropdown && (
            <div className="role-passport-dropdown" style={{ width: '200px' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{currentUser?.email}</div>
              </div>
              <button
                className="role-passport-option"
                onClick={() => {
                  setShowProfileDropdown(false);
                  logout();
                }}
                style={{ color: '#f43f5e', flexDirection: 'row', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={14} />
                <span className="role-option-title" style={{ color: '#f43f5e' }}>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
