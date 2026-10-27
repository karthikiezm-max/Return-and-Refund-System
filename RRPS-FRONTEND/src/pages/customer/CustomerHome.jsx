import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  MonthlyTrendsChart,
  CategoryReturnsChart,
  RefundDistributionChart
} from '../../components/common/Charts';
import {
  RotateCcw,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Navigation,
  FileText
} from 'lucide-react';
import './CustomerHome.css';

export const CustomerHome = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { returnRequests, refunds, fetchBackendData } = useApp();

  React.useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Active customer returns
  const userReturns = returnRequests.filter(
    r => (r.customer_name && currentUser?.name && r.customer_name.toLowerCase() === currentUser.name.toLowerCase()) || currentUser?.role !== 'customer'
  );

  const pendingLogisticsCount = returnRequests.filter(
    r => r.status === 'PICKUP_SCHEDULED' || r.status === 'INITIATED'
  ).length;

  const qcDoneCount = returnRequests.filter(r => r.status === 'QC_DONE').length;
  const refundedCount = refunds.filter(rf => rf.status === 'CREDITED').length;

  return (
    <div className="customer-home">
      {/* 2. Customer Portal: Home Dashboard Banner matching Screenshot 2 */}
      <div className="customer-welcome-banner">
        <div>
          <h2 className="welcome-title">
            Welcome to Return Center, {currentUser?.name || 'Karthik'}
          </h2>
          <p className="welcome-subtitle">
            Manage your orders, file standard return requests, check exchange updates, or review refunds policy instantly.
          </p>
        </div>
        <div className="welcome-actions">
          <button
            className="btn-primary"
            onClick={() => onNavigate('customer_initiate')}
          >
            <PlusCircle size={16} />
            <span>Initiate Return</span>
          </button>
          <button
            className="btn-secondary"
            onClick={() => onNavigate('customer_track')}
          >
            <Navigation size={16} />
            <span>Track Return</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="overview-summary-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>
            <RotateCcw size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{userReturns.length}</span>
            <span className="metric-title">Total Returns</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Truck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{pendingLogisticsCount}</span>
            <span className="metric-title">Pending Logistics</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <Clock size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{qcDoneCount}</span>
            <span className="metric-title">QC Inspection</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{refundedCount}</span>
            <span className="metric-title">Refunds Processed</span>
          </div>
        </div>
      </div>

      {/* 3 Dashboard Charts matching Screenshot 2 */}
      <div className="charts-grid">
        <MonthlyTrendsChart />
        <CategoryReturnsChart />
        <RefundDistributionChart />
      </div>

      {/* Quick Access Grid */}
      <div className="surface-card">
        <div className="section-header-row">
          <h3 className="section-heading">Active Return Quick Overview</h3>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            onClick={() => onNavigate('customer_history')}
          >
            <span>View Full Return History</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 10px' }}>Return ID</th>
                <th style={{ padding: '12px 10px' }}>Order ID</th>
                <th style={{ padding: '12px 10px' }}>Product</th>
                <th style={{ padding: '12px 10px' }}>Type</th>
                <th style={{ padding: '12px 10px' }}>Price</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userReturns.slice(0, 4).map((r) => (
                <tr key={r.return_id} style={{ borderBottom: '1px solid #141f33' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                    {r.return_id}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{r.order_id}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 500, color: '#f8fafc' }}>{r.product_name}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-neutral">{r.return_type}</span>
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)' }}>${r.price.toFixed(2)}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      className={`badge ${
                        r.status === 'REFUNDED'
                          ? 'badge-green'
                          : r.status === 'PICKUP_SCHEDULED'
                          ? 'badge-amber'
                          : 'badge-blue'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                      onClick={() => onNavigate('customer_track')}
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
