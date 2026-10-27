import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Truck,
  Clock,
  CheckCircle2,
  Sliders,
  Eye,
  FileSpreadsheet,
  Search,
  ThumbsUp,
  Award
} from 'lucide-react';
import { ReturnDetailsModal } from '../../components/modals/ReturnDetailsModal';
import './SupportDashboard.css';

export const SupportDashboard = ({ onNavigateOverride }) => {
  const { returnRequests, refunds } = useApp();
  const [search, setSearch] = useState('');
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const pendingLogistics = returnRequests.filter(
    r => r.status === 'PICKUP_SCHEDULED' || r.status === 'INITIATED'
  ).length;

  const qcPending = returnRequests.filter(
    r => r.status === 'RECEIVED' || r.status === 'QC_IN_PROGRESS'
  ).length;

  const refundsProcessed = refunds.filter(rf => rf.status === 'CREDITED').length;

  const filteredReturns = returnRequests.filter(r =>
    r.return_id.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    r.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="support-dashboard-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Customer Support: Agent Dashboard
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Monitor active returns, review customer escalations, and manage policy window overrides.
        </p>
      </div>

      {/* 4 KPI cards matching Screenshot 7 */}
      <div className="support-kpis-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>
            <RotateCcw size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{returnRequests.length}</span>
            <span className="metric-title">Total Returns</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Truck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{pendingLogistics}</span>
            <span className="metric-title">Pending Logistics</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <Clock size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{qcPending || 1}</span>
            <span className="metric-title">QC Pending Inspection</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{refundsProcessed}</span>
            <span className="metric-title">Refunds Processed</span>
          </div>
        </div>
      </div>

      {/* Support Performance Card matching Screenshot 7 */}
      <div className="support-performance-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Support Team Performance</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Customer Satisfaction (CSAT): <span className="perf-metric-val">94%</span> • Avg First Contact Resolution: <span className="perf-metric-val">4.2 hrs</span>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '7px 14px' }}
          onClick={onNavigateOverride}
        >
          <Sliders size={14} />
          <span>Operational Override Desk</span>
        </button>
      </div>

      {/* Returns Queue matching Screenshot 7 */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#f8fafc' }}>
            Customer Returns Queue
          </h3>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '32px', paddingBottom: '6px', paddingTop: '6px' }}
              placeholder="Filter returns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((row) => (
                <tr key={row.return_id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                    {row.return_id}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{row.order_id}</td>
                  <td style={{ fontWeight: 500, color: '#fff' }}>{row.customer_name}</td>
                  <td>{row.product_name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${row.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === 'REFUNDED'
                          ? 'badge-green'
                          : row.status === 'PICKUP_SCHEDULED'
                          ? 'badge-amber'
                          : 'badge-blue'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                      onClick={() => setSelectedReturnId(row.return_id)}
                    >
                      <Eye size={13} />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReturnDetailsModal
        returnId={selectedReturnId}
        onClose={() => setSelectedReturnId(null)}
      />
    </div>
  );
};
