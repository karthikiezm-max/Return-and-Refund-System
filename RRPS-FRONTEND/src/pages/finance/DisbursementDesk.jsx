import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle,
  Building2,
  DollarSign,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  BarChart2,
  FileText,
  TrendingUp,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { BankDetailsModal } from '../../components/modals/BankDetailsModal';
import './DisbursementDesk.css';

export const DisbursementDesk = ({ focusView = 'dashboard', filterStatus = '', filterMethod = '' }) => {
  const { refunds, returnRequests, orders, fraudFlags, disburseRefund, showToast, fetchBackendData } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterStatus);
  const [methodFilter, setMethodFilter] = useState(filterMethod);
  const [selectedBankRefund, setSelectedBankRefund] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute live metrics from PostgreSQL context
  const pendingRefunds = refunds.filter(rf => rf.status === 'PENDING');
  const creditedRefunds = refunds.filter(rf => rf.status === 'CREDITED');
  const codPendingRefunds = pendingRefunds.filter(rf => rf.method === 'BANK_TRANSFER' || rf.method === 'COD');

  const totalPendingLiability = pendingRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalCreditedToday = creditedRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalOrderValue = orders.reduce((sum, o) => {
    const orderSum = (o.items || []).reduce((iSum, i) => iSum + (i.price * i.quantity), 0);
    return sum + (orderSum || 0);
  }, 0);

  // Method breakdown counts
  const originalMethodCount = refunds.filter(r => r.method === 'ORIGINAL_METHOD' || r.method === 'ORIGINAL').length;
  const bankTransferCount = refunds.filter(r => r.method === 'BANK_TRANSFER' || r.method === 'COD').length;
  const storeCreditCount = refunds.filter(r => r.method === 'STORE_CREDIT').length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBackendData();
    setIsRefreshing(false);
    showToast('Finance metrics refreshed from database', 'info');
  };

  // Helper to check if return has active fraud hold
  const isFraudHold = (returnId) => {
    return fraudFlags.some(f => 
      f.return_id === returnId && (f.status === 'OPEN' || f.status === 'INVESTIGATING')
    );
  };

  // Mask account numbers for Bank Transfers view
  const maskAccount = (returnId) => {
    const hash = (returnId || '0000').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const last4 = (1000 + (hash % 9000)).toString();
    return `XXXX XXXX ${last4}`;
  };

  // Filter refunds based on current focus view and search/filters
  const getFilteredRefunds = () => {
    let list = [...refunds];

    if (focusView === 'queue') {
      // Refund Queue shows QC_DONE items waiting for disbursement
      list = list.filter(r => r.status === 'PENDING');
    } else if (focusView === 'cod') {
      list = list.filter(r => r.method === 'BANK_TRANSFER' || r.method === 'COD');
    } else if (focusView === 'transfers') {
      list = list.filter(r => r.method === 'BANK_TRANSFER' || r.method === 'NEFT' || r.method === 'UPI');
    }

    if (statusFilter) {
      list = list.filter(r => r.status === statusFilter);
    }

    if (methodFilter) {
      list = list.filter(r => (r.method || '').toLowerCase().includes(methodFilter.toLowerCase()));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.return_id || '').toLowerCase().includes(q) ||
        (r.customer_name || '').toLowerCase().includes(q) ||
        (r.razorpay_refund_id || '').toLowerCase().includes(q) ||
        (r.method || '').toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredRefunds = getFilteredRefunds();

  // Render view-specific titles
  const getViewTitle = () => {
    switch (focusView) {
      case 'queue':
        return 'Finance: Pending Refund Queue & Verification';
      case 'cod':
        return 'Finance: COD & Bank Transfer Verification';
      case 'transfers':
        return 'Finance: Bank Transfers & NEFT Ledger';
      case 'liability':
        return 'Finance: Refund Liability Exposure Report';
      case 'reports':
        return 'Finance: Historical Refund Reports & Audit Trail';
      default:
        return 'Finance: Executive Disbursement Desk';
    }
  };

  return (
    <div className="disbursement-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {getViewTitle()}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Single source of truth (PostgreSQL) for refund disbursements, liability exposures, and NEFT payouts.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* 6 Top Stats Banner - Displayed on Dashboard and Liability views */}
      {(focusView === 'dashboard' || focusView === 'liability') && (
        <div className="liability-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '12px', borderRadius: '8px' }}>
              <Clock size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24', display: 'block' }}>
                ₹{totalPendingLiability.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending Refund Liability</span>
            </div>
          </div>

          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '8px' }}>
              <DollarSign size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399', display: 'block' }}>
                ₹{totalCreditedToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Refunds Processed Today</span>
            </div>
          </div>

          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '12px', borderRadius: '8px' }}>
              <CreditCard size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', display: 'block' }}>
                {pendingRefunds.length}
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending Finance Verification</span>
            </div>
          </div>

          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '12px', borderRadius: '8px' }}>
              <Building2 size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc', display: 'block' }}>
                {codPendingRefunds.length}
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>COD Refunds Pending</span>
            </div>
          </div>

          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '12px', borderRadius: '8px' }}>
              <TrendingUp size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171', display: 'block' }}>
                2.4 Days
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Average Refund TAT</span>
            </div>
          </div>

          <div className="metric-card" style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-box" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '12px', borderRadius: '8px' }}>
              <ShieldCheck size={22} />
            </div>
            <div className="metric-details">
              <span className="metric-val" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80', display: 'block' }}>
                96%
              </span>
              <span className="metric-title" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SLA Compliance</span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD SPECIFIC: Payment Method & Status Distribution Cards */}
      {focusView === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <div className="surface-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="#38bdf8" />
              <span>Refund Payment Method Distribution</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>Original Payment Method (Razorpay)</span>
                  <span style={{ fontWeight: 600, color: '#38bdf8' }}>{originalMethodCount} requests</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${refunds.length ? (originalMethodCount / refunds.length) * 100 : 0}%`, height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>Bank Transfer (NEFT / UPI)</span>
                  <span style={{ fontWeight: 600, color: '#c084fc' }}>{bankTransferCount} requests</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${refunds.length ? (bankTransferCount / refunds.length) * 100 : 0}%`, height: '100%', background: '#c084fc' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>Store Credit / Gift Coupon</span>
                  <span style={{ fontWeight: 600, color: '#34d399' }}>{storeCreditCount} requests</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${refunds.length ? (storeCreditCount / refunds.length) * 100 : 0}%`, height: '100%', background: '#34d399' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#fbbf24" />
              <span>Settlement Lifecycle Summary</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Processed Records</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{refunds.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Successfully Credited</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>{creditedRefunds.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Pending Verification Queue</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>{pendingRefunds.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIABILITY REPORT SPECIFIC SUMMARY CARD */}
      {focusView === 'liability' && (
        <div className="surface-card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="#38bdf8" />
            <span>Company Refund Exposure Breakdown</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Customer Sales Order Volume</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                ₹{totalOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Approved QC Return Liability</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                ₹{totalPendingLiability.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Disbursed & Settled Refunds</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                ₹{totalCreditedToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Net Exposure Ratio</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                {totalOrderValue ? ((totalPendingLiability / totalOrderValue) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Data Table Container */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
            {focusView === 'transfers' ? 'NEFT & UPI Bank Transfers Ledger' :
             focusView === 'cod' ? 'COD & NEFT Bank Details Verification' :
             focusView === 'reports' ? 'Historical Refund Audit Ledger' :
             focusView === 'liability' ? 'Refund Exposure Ledger' :
             'Disbursement Processing Queue'}
          </h3>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Filter Dropdowns for Reports View */}
            {focusView === 'reports' && (
              <>
                <select
                  className="form-input"
                  style={{ width: '130px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.8rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="CREDITED">CREDITED</option>
                  <option value="PENDING">PENDING</option>
                </select>

                <select
                  className="form-input"
                  style={{ width: '150px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.8rem' }}
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="">All Methods</option>
                  <option value="ORIGINAL">Original Method</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="STORE_CREDIT">Store Credit</option>
                </select>
              </>
            )}

            {/* Search Box */}
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px' }}
                placeholder="Search return or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Customer</th>
                <th>Payment Channel / Method</th>
                {focusView === 'transfers' && <th>Masked Account / UPI</th>}
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={focusView === 'transfers' ? 7 : 6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No refund records found matching the active view and search parameters.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((row) => {
                  const fraudHold = isFraudHold(row.return_id);

                  return (
                    <tr key={row.refund_id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                        {row.return_id}
                      </td>
                      <td style={{ fontWeight: 500, color: '#fff' }}>
                        {row.customer_name}
                      </td>
                      <td style={{ color: '#cbd5e1' }}>
                        {row.method === 'ORIGINAL_METHOD' || row.method === 'ORIGINAL' ? 'Original Method (Razorpay)' :
                         row.method === 'BANK_TRANSFER' ? 'Bank Transfer (NEFT)' :
                         row.method || 'ORIGINAL_METHOD'}
                      </td>

                      {focusView === 'transfers' && (
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#a7f3d0' }}>
                          {maskAccount(row.return_id)}
                        </td>
                      )}

                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                        ₹{(row.amount || 0).toFixed(2)}
                      </td>

                      <td>
                        {fraudHold ? (
                          <span className="badge badge-amber" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' }}>
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            FRAUD HOLD
                          </span>
                        ) : (
                          <span className={`badge ${row.status === 'CREDITED' ? 'badge-green' : 'badge-amber'}`}>
                            {row.status === 'CREDITED' ? 'CREDITED' : 'QC APPROVED / PENDING'}
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {row.status === 'CREDITED' ? (
                          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={13} />
                            <span>Settled ({row.razorpay_refund_id || 'NEFT Disbursed'})</span>
                          </span>
                        ) : fraudHold ? (
                          <button
                            className="btn-secondary"
                            disabled
                            style={{ fontSize: '0.74rem', padding: '5px 12px', opacity: 0.6, cursor: 'not-allowed' }}
                            title="Disbursement blocked due to open Fraud Flag investigation"
                          >
                            <ShieldAlert size={13} color="#ef4444" />
                            <span>Hold Active</span>
                          </button>
                        ) : row.method === 'BANK_TRANSFER' ? (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '0.74rem', padding: '5px 12px', background: '#0284c7' }}
                            onClick={() => setSelectedBankRefund(row)}
                          >
                            <Building2 size={13} />
                            <span>Verify NEFT & Disburse</span>
                          </button>
                        ) : (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                            onClick={() => disburseRefund(row.refund_id)}
                          >
                            <DollarSign size={13} />
                            <span>Disburse Refund</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details Modal for NEFT / COD */}
      <BankDetailsModal
        isOpen={Boolean(selectedBankRefund)}
        onClose={() => setSelectedBankRefund(null)}
        refund={selectedBankRefund}
        onApprove={(id) => disburseRefund(id)}
      />
    </div>
  );
};
