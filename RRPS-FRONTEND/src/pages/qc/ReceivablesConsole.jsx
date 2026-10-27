import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Truck,
  Clock,
  CheckCircle2,
  QrCode,
  CheckSquare,
  Search,
  Scan
} from 'lucide-react';
import { BarcodeScannerModal } from '../../components/modals/BarcodeScannerModal';
import './ReceivablesConsole.css';

export const ReceivablesConsole = ({ filterStatus, onNavigateAppraisal }) => {
  const { returnRequests, refunds } = useApp();
  const [search, setSearch] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const pendingLogistics = returnRequests.filter(
    r => r.status === 'PICKUP_SCHEDULED' || r.status === 'INITIATED' || r.status === 'IN_TRANSIT'
  ).length;

  const qcPending = returnRequests.filter(
    r => r.status !== 'QC_DONE' && r.status !== 'REFUNDED' && r.status !== 'CANCELLED' && r.status !== 'CLOSED'
  ).length;

  const refundsProcessed = refunds.filter(rf => rf.status === 'CREDITED').length;

  const filteredReturns = returnRequests.filter(r => {
    const matchesSearch =
      r.return_id.toLowerCase().includes(search.toLowerCase()) ||
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'PENDING') {
      return r.status !== 'QC_DONE' && r.status !== 'REFUNDED' && r.status !== 'CANCELLED' && r.status !== 'CLOSED';
    }
    if (filterStatus === 'COMPLETED') {
      return r.status === 'QC_DONE' || r.status === 'REFUNDED';
    }
    return true;
  });

  return (
    <div className="qc-console-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Warehouse QC: Receivables Console
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Inbound packages intake queue, reverse AWB scan verification, and appraisal workstation.
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Barcode Scanner Callout Banner */}
      <div className="scanner-launch-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Scan size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', color: '#fff', fontWeight: 600 }}>
              Warehouse Intake Barcode Camera
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Simulate barcode scan on received courier parcels to instantly open QC inspection.
            </span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsScannerOpen(true)}>
          <QrCode size={16} />
          <span>Launch Barcode Scanner</span>
        </button>
      </div>

      {/* Warehouse Receivables Queue Table */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#f8fafc' }}>
            Warehouse Receivables Queue {filterStatus ? `(${filterStatus})` : ''}
          </h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px' }}
              placeholder="Search barcode or SKU..."
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
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    No return items matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((row) => (
                  <tr key={row.return_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                      {row.return_id}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{row.order_id}</td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{row.customer_name}</td>
                    <td>{row.product_name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${row.price.toFixed(2)}</td>
                    <td>
                      {(() => {
                        const rf = refunds.find(r => r.return_id === row.return_id);
                        const isCredited = row.status === 'REFUNDED' || rf?.status === 'CREDITED';
                        const isPending = row.status === 'QC_DONE' || rf?.status === 'PENDING';

                        if (isCredited) {
                          return <span className="badge badge-green">CREDITED</span>;
                        } else if (isPending) {
                          return <span className="badge badge-amber">PENDING</span>;
                        }
                        return <span className="badge badge-amber">{row.status}</span>;
                      })()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {row.status !== 'QC_DONE' && row.status !== 'REFUNDED' ? (
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                          onClick={() => onNavigateAppraisal(row.return_id)}
                        >
                          <CheckSquare size={13} />
                          <span>Inspect Item</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Inspected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectBarcode={(code) => onNavigateAppraisal(code)}
      />
    </div>
  );
};
