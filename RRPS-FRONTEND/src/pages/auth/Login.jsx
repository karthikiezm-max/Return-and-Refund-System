import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ChevronRight, UserCheck } from 'lucide-react';
import './Login.css';

export const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('support@enterprise.com');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('customer_support');

  const handleSubmit = (e) => {
    e?.preventDefault();
    login(email, password, role);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleQuickSelect = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('admin123');
    setRole(demoRole);
    login(demoEmail, 'admin123', demoRole);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="login-page-container">
      <div className="login-bg-glow" />

      <div className="login-card">
        {/* Shield Icon matching screenshot 1 */}
        <div className="login-icon-wrap">
          <Shield size={24} color="#ffffff" />
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to access your operations dashboard</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                required
              />
              <Mail
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <Lock
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '12px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Operational Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                if (newRole === 'customer') setEmail('karthik@example.com');
                else if (newRole === 'customer_support') setEmail('support@enterprise.com');
                else if (newRole === 'warehouse_qc') setEmail('qc@warehouse.com');
                else if (newRole === 'finance') setEmail('finance@rrms.com');
                else if (newRole === 'supplier_manager') setEmail('supplier@elco.com');
                else if (newRole === 'admin') setEmail('admin@rrms.com');
              }}
            >
              <option value="customer">Customer Portal (Karthik)</option>
              <option value="customer_support">Customer Support Agent</option>
              <option value="warehouse_qc">Warehouse QC Staff</option>
              <option value="finance">Finance Manager</option>
              <option value="supplier_manager">Supplier Manager</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn-primary login-btn-submit">
            <span>Sign In to Dashboard</span>
            <ChevronRight size={18} />
          </button>
        </form>

        {/* Quick Demo Passport Buttons */}
        <div className="demo-accounts-box">
          <div className="demo-title">Quick Role Passports</div>
          <div className="demo-pills-grid">
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('karthik@example.com', 'customer')}
            >
              <span>Customer (Karthik)</span>
              <UserCheck size={13} />
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('support@enterprise.com', 'customer_support')}
            >
              <span>Support Desk</span>
              <UserCheck size={13} />
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('qc@warehouse.com', 'warehouse_qc')}
            >
              <span>Warehouse QC</span>
              <UserCheck size={13} />
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('finance@rrms.com', 'finance')}
            >
              <span>Finance Manager</span>
              <UserCheck size={13} />
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('supplier@elco.com', 'supplier_manager')}
            >
              <span>Supplier Manager</span>
              <UserCheck size={13} />
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickSelect('admin@rrms.com', 'admin')}
            >
              <span>Admin Console</span>
              <UserCheck size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
