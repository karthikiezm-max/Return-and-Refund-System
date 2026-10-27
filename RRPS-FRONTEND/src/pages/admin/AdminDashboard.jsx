import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MonthlyTrendsChart,
  CategoryReturnsChart,
  RefundDistributionChart
} from '../../components/common/Charts';
import {
  RotateCcw,
  Truck,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Search,
  Eye
} from 'lucide-react';
import { ReturnDetailsModal } from '../../components/modals/ReturnDetailsModal';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { returnRequests, refunds, showToast, fetchBackendData } = useApp();
  const [search, setSearch] = useState('');
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  React.useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const pendingLogistics = returnRequests.filter(
    r => r.status === 'PICKUP_SCHEDULED' || r.status === 'INITIATED'
  ).length;

  const qcPending = returnRequests.filter(
    r => r.status === 'RECEIVED' || r.status === 'QC_IN_PROGRESS'
  ).length;

  const refundsProcessed = refunds.filter(rf => rf.status === 'CREDITED').length;

  const filteredReturns = returnRequests.filter(r =>
    r.return_id.toLowerCase().includes(search.toLowerCase()) ||
    r.product_name.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Return ID,Order ID,Customer,Product,Price,Status'];
    const rows = filteredReturns.map(r =>
      `"${r.return_id}","${r.order_id}","${r.customer_name}","${r.product_name}",${r.price},"${r.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RRPS_Platform_Overview_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Platform overview report downloaded.');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="admin-dashboard-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          System Administrator Dashboard
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Platform-wide reverse logistics operations, reverse fulfillment metrics, and SLA monitoring.
        </p>
      </div>

      {/* 4 KPI cards matching Screenshot 14 */}
      <div className="overview-summary-grid">
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
            <span className="metric-val">{qcPending}</span>
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

      {/* 3 Charts matching Screenshot 14 */}
      <div className="charts-grid">
        <MonthlyTrendsChart />
        <CategoryReturnsChart />
        <RefundDistributionChart />
      </div>

      {/* Platform Transactions Table matching Screenshot 14 */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
            Platform Active Returns
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px' }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            </div>

            <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={handleExportCSV}>
              <FileSpreadsheet size={14} color="#10b981" />
              <span>Export CSV</span>
            </button>
            <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={handleExportPDF}>
              <FileText size={14} color="#f43f5e" />
              <span>Export PDF</span>
            </button>
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
                      <span>Audit Dossier</span>
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
