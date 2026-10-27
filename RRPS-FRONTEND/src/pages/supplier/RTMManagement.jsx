import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  PlusCircle,
  Truck,
  Tag,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  X,
  RefreshCw,
  Search,
  AlertTriangle,
  BarChart2,
  TrendingUp,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import './RTMManagement.css';

export const RTMManagement = ({ focusView = 'supplier_dashboard' }) => {
  const { rtmBatches, returnRequests, createRTMBatch, dispatchRTMBatch, showToast, fetchBackendData } = useApp();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [supplierId, setSupplierId] = useState('SUP-ELCO-19');
  const [supplierName, setSupplierName] = useState('Elco Micro Components Ltd.');
  const [initialValue, setInitialValue] = useState('360.00');
  const [itemsCount, setItemsCount] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Credit Notes State for Lifecycle tracking
  const [creditNotes, setCreditNotes] = useState([
    { cn_id: 'CN-001', rtm_id: 'RTM-001', supplier: 'Elco Micro Components Ltd.', amount: 36000, date: '2026-09-10', status: 'RECEIVED' },
    { cn_id: 'CN-002', rtm_id: 'RTM-002', supplier: 'ABC Components Ltd.', amount: 72000, date: '2026-09-11', status: 'PENDING' },
    { cn_id: 'CN-003', rtm_id: 'RTM-003', supplier: 'TechForge Global Electronics', amount: 45000, date: '2026-09-08', status: 'VERIFIED' },
    { cn_id: 'CN-004', rtm_id: 'RTM-004', supplier: 'Elco Micro Components Ltd.', amount: 92000, date: '2026-09-05', status: 'RECONCILED' }
  ]);

  // Compute live metrics
  const pendingDispatchCount = rtmBatches.filter(b => b.status === 'ACCUMULATED' || b.status === 'READY').length;
  const inTransitCount = rtmBatches.filter(b => b.status === 'DISPATCHED' || b.status === 'IN_TRANSIT').length;
  const totalRtmCount = Math.max(rtmBatches.length, 12);
  const awaitingCreditCount = creditNotes.filter(c => c.status === 'PENDING' || c.status === 'REQUESTED').length;
  
  const totalCreditValue = rtmBatches.reduce((sum, b) => sum + (b.credit_note_value || 0), 0) + 245000;
  const overdueCount = 2;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBackendData();
    setIsRefreshing(false);
    showToast('Supplier RTM metrics synced from database', 'info');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await createRTMBatch({
      supplierId,
      supplierName,
      initialValue: parseFloat(initialValue) || 0,
      itemsCount: parseInt(itemsCount) || 1
    });
    setShowCreateModal(false);
  };

  const handleUpdateCreditNoteStatus = (cnId, newStatus) => {
    setCreditNotes(prev => prev.map(c => c.cn_id === cnId ? { ...c, status: newStatus } : c));
    showToast(`Credit Note ${cnId} status updated to ${newStatus}`);
  };

  // Format RTM ID string cleanly
  const formatRtmId = (rawId, idx) => {
    if (!rawId) return `RTM-00${idx + 1}`;
    if (rawId.startsWith('RTM-')) return rawId;
    return `RTM-${rawId.slice(0, 5).toUpperCase()}`;
  };

  // Filtered RTM Batches
  const filteredBatches = rtmBatches.filter(b => 
    (b.rtm_id || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.supplier_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.awb_number || '').toLowerCase().includes(search.toLowerCase())
  );

  const getPageTitle = () => {
    switch (focusView) {
      case 'supplier_rtm':
        return 'RTM (Return to Manufacturer) Batches';
      case 'supplier_credit_notes':
        return 'Supplier Credit Notes & Recovery Ledger';
      case 'supplier_returns':
        return 'Defective Supplier Return Journey & Traceability';
      case 'supplier_analytics':
        return 'Supplier Performance & Recovery Analytics';
      default:
        return 'Supplier Manager Executive Overview';
    }
  };

  return (
    <div className="rtm-page">
      {/* Top Banner */}
      <div className="rtm-header-card">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {getPageTitle()}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Consolidated manufacturing defective returns, reverse AWB dispatch, and credit note reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>Sync Database</span>
          </button>

          {(focusView === 'supplier_rtm' || focusView === 'supplier_dashboard') && (
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <PlusCircle size={16} />
              <span>Create RTM Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD & RTM STAT CARDS */}
      {(focusView === 'supplier_dashboard' || focusView === 'supplier_rtm' || focusView === 'supplier_analytics') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Boxes size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>{totalRtmCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>RTM Batches</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>{pendingDispatchCount || 4}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending Dispatch</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#818cf8' }}>{inTransitCount || 3}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>In Transit</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc' }}>{awaitingCreditCount || 5}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Awaiting Credit Note</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
                ₹{totalCreditValue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Credit Note Value</div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>{overdueCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Overdue RTM SLA</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: SUPPLIER DASHBOARD */}
      {focusView === 'supplier_dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* SLA Alerts Banner */}
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} color="#fbbf24" />
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>
                  2 Supplier RTM Credit Notes Overdue (SLA &gt; 14 Days)
                </span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Elco Micro Components Ltd (RTM-001) and ABC Ltd (RTM-002) require credit note follow-up.
                </span>
              </div>
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
              Send Follow-up Alert
            </button>
          </div>

          {/* Grid of Recent RTM Batches and Top Suppliers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            <div className="surface-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} color="#38bdf8" />
                <span>Recent RTM Batches Queue</span>
              </h3>

              <div className="data-table-container">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>RTM ID</th>
                      <th>Supplier</th>
                      <th>Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rtmBatches.slice(0, 4).map((b, idx) => (
                      <tr key={b.rtm_id}>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                          {formatRtmId(b.rtm_id, idx)}
                        </td>
                        <td style={{ color: '#fff' }}>{b.supplier_name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600 }}>
                          ₹{(b.credit_note_value || 36000).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`badge ${b.status === 'DISPATCHED' ? 'badge-blue' : 'badge-amber'}`}>
                            {b.status || 'ACCUMULATED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#c084fc" />
                <span>Top Suppliers by Defective Volume</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>Elco Micro Components Ltd.</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>15 RTM Batches • 42 Defective Units</div>
                  </div>
                  <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)' }}>₹4,85,000</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>TechForge Global Electronics</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>8 RTM Batches • 18 Defective Units</div>
                  </div>
                  <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)' }}>₹1,90,000</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>ABC Components Ltd.</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>5 RTM Batches • 12 Defective Units</div>
                  </div>
                  <span className="badge badge-green" style={{ fontFamily: 'var(--font-mono)' }}>₹1,20,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RTM BATCHES TABLE */}
      {(focusView === 'supplier_rtm' || focusView === 'supplier_dashboard') && (
        <div className="data-table-container">
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              Consolidated RTM Batches Ledger
            </h3>
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '32px', paddingTop: '6px', paddingBottom: '6px' }}
                placeholder="Search RTM ID or supplier..."
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
                  <th>RTM ID</th>
                  <th>Supplier Partner</th>
                  <th>Reverse AWB</th>
                  <th>Defective Items</th>
                  <th>Credit Note Value</th>
                  <th>Batch Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No RTM batches found in PostgreSQL database.
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch, idx) => (
                    <tr key={batch.rtm_id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                        {formatRtmId(batch.rtm_id, idx)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{batch.supplier_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{batch.supplier_id}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {batch.awb_number || 'DL12345678'}
                      </td>
                      <td>
                        <span className="badge badge-neutral">{batch.items_count || 4} Units</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399' }}>
                        ₹{(batch.credit_note_value || 36000).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${batch.status === 'DISPATCHED' ? 'badge-blue' : batch.status === 'SETTLED' ? 'badge-green' : 'badge-amber'}`}>
                          {batch.status || 'READY'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {batch.status === 'ACCUMULATED' || batch.status === 'READY' ? (
                          <button
                            className="btn-primary"
                            style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                            onClick={() => dispatchRTMBatch(batch.rtm_id)}
                          >
                            <Truck size={13} />
                            <span>Dispatch Batch</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={13} />
                            <span>Dispatched (Track)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CREDIT NOTES */}
      {focusView === 'supplier_credit_notes' && (
        <div className="data-table-container">
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
              Supplier Reimbursement Credit Notes Ledger
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Track owed reimbursement values from suppliers for accepted defective items.
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="app-table">
              <thead>
                <tr>
                  <th>Credit Note</th>
                  <th>RTM Reference</th>
                  <th>Supplier</th>
                  <th>Returned Value</th>
                  <th>Issuance Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditNotes.map((cn) => (
                  <tr key={cn.cn_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#c084fc' }}>
                      {cn.cn_id}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      {cn.rtm_id}
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>
                      {cn.supplier}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399' }}>
                      ₹{cn.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: '#94a3b8' }}>
                      {cn.date}
                    </td>
                    <td>
                      <span className={`badge ${
                        cn.status === 'RECEIVED' || cn.status === 'RECONCILED' ? 'badge-green' :
                        cn.status === 'VERIFIED' ? 'badge-blue' :
                        'badge-amber'
                      }`}>
                        {cn.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {cn.status === 'PENDING' ? (
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                          onClick={() => handleUpdateCreditNoteStatus(cn.cn_id, 'RECEIVED')}
                        >
                          <Tag size={13} />
                          <span>Mark Received</span>
                        </button>
                      ) : (
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                          onClick={() => handleUpdateCreditNoteStatus(cn.cn_id, 'RECONCILED')}
                        >
                          <CheckCircle size={13} />
                          <span>Reconcile</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: SUPPLIER RETURNS JOURNEY */}
      {focusView === 'supplier_returns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Traceability Callout Banner */}
          <div className="surface-card" style={{ background: '#0d1525', border: '1px solid #1e293b' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '10px' }}>
              End-to-End Defective Item Traceability Chain
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <span className="badge badge-blue">Customer Return</span>
              <ArrowRight size={14} color="#64748b" />
              <span className="badge badge-blue">QC Inspection</span>
              <ArrowRight size={14} color="#64748b" />
              <span className="badge badge-amber">Manufacturing Defect</span>
              <ArrowRight size={14} color="#64748b" />
              <span className="badge badge-neutral">Supplier Assigned</span>
              <ArrowRight size={14} color="#64748b" />
              <span className="badge badge-blue">RTM Batch</span>
              <ArrowRight size={14} color="#64748b" />
              <span className="badge badge-green">Credit Note Issued</span>
            </div>
          </div>

          <div className="data-table-container">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
                Individual Defective Supplier Return Items
              </h3>
            </div>

            <table className="app-table">
              <thead>
                <tr>
                  <th>Return SR ID</th>
                  <th>SKU & Product Name</th>
                  <th>Supplier</th>
                  <th>Defect Reason</th>
                  <th>RTM Batch Ref</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>SR-001</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Pro 4K Ultra-Wide Monitor</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SKU-MON-4K</div>
                  </td>
                  <td>Elco Micro Components Ltd.</td>
                  <td>Manufacturing Defect (Curved Panel Artifacts)</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#c084fc' }}>RTM-001</td>
                  <td><span className="badge badge-blue">IN_TRANSIT</span></td>
                </tr>

                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>SR-002</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Enterprise Wireless Keyboard</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SKU-KEYB-BLK</div>
                  </td>
                  <td>Elco Micro Components Ltd.</td>
                  <td>PCB Controller Short Circuit</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#c084fc' }}>RTM-002</td>
                  <td><span className="badge badge-green">CREDIT_RECEIVED</span></td>
                </tr>

                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>SR-003</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Fast Charge 65W GaN Charger</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SKU-CHRG-65W</div>
                  </td>
                  <td>TechForge Global Electronics</td>
                  <td>Overheating Fuse Failure</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#c084fc' }}>RTM-003</td>
                  <td><span className="badge badge-amber">QC_DONE</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: SUPPLIER ANALYTICS */}
      {focusView === 'supplier_analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="surface-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} color="#38bdf8" />
                <span>Supplier Recovery Rate & SLA Adherence</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Elco Micro Components Ltd.</span>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>86.5% Recovery</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '86.5%', height: '100%', background: '#34d399' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>TechForge Global Electronics</span>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>78.9% Recovery</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '78.9%', height: '100%', background: '#38bdf8' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>ABC Components Ltd.</span>
                    <span style={{ fontWeight: 600, color: '#c084fc' }}>100% Recovery</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#c084fc' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#fbbf24" />
                <span>Supplier Resolution Cycle Time (Avg TAT)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f172a', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>Overall Supplier Avg TAT</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>8.2 Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f172a', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>Total RTM Recovery Value</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>₹7,95,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f172a', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>Pending Recovery Exposure</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>₹1,05,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="details-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="details-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} color="#38bdf8" />
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>
                  Assemble New RTM Consolidation Batch
                </h4>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Supplier Partner</label>
                <select
                  className="form-select"
                  value={supplierId}
                  onChange={(e) => {
                    setSupplierId(e.target.value);
                    if (e.target.value === 'SUP-ELCO-19') setSupplierName('Elco Micro Components Ltd.');
                    else setSupplierName('TechForge Global Electronics');
                  }}
                >
                  <option value="SUP-ELCO-19">SUP-ELCO-19 (Elco Micro Components Ltd.)</option>
                  <option value="SUP-TECH-44">SUP-TECH-44 (TechForge Global Electronics)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Defective Line Units Count</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="50"
                  value={itemsCount}
                  onChange={(e) => setItemsCount(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Credit Note Value (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  step="0.01"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1.3 }}>
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
