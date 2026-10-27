import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Package, Truck, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
import './ReturnDetailsModal.css';

export const ReturnDetailsModal = ({ returnId, onClose }) => {
  const { returnRequests, returnItems, pickups, qcInspections, refunds } = useApp();

  if (!returnId) return null;

  const ret = returnRequests.find(r => r.return_id === returnId);
  const item = returnItems.find(i => i.return_id === returnId);
  const pickup = pickups.find(p => p.return_id === returnId);
  const qc = qcInspections.find(q => q.return_id === returnId);
  const refund = refunds.find(rf => rf.return_id === returnId);

  if (!ret) return null;

  return (
    <div className="details-modal-backdrop" onClick={onClose}>
      <div className="details-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="details-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Return Dossier: {ret.return_id}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-modal-body">
          {/* Master Info */}
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Customer & Order</div>
              <div className="detail-val">{ret.customer_name} ({ret.customer_id})</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Order Ref: {ret.order_id}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Product & Value</div>
              <div className="detail-val">{ret.product_name}</div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '2px' }}>
                ${ret.price.toFixed(2)} • {ret.return_type}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Lifecycle Status</div>
              <span className={`badge ${ret.status === 'REFUNDED' ? 'badge-green' : ret.status === 'PICKUP_SCHEDULED' ? 'badge-amber' : 'badge-blue'}`}>
                {ret.status}
              </span>
              {ret.support_override && (
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>
                  ★ Overridden by Support: {ret.override_reason}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">Initiated Timestamp</div>
              <div className="detail-val" style={{ fontFamily: 'var(--font-mono)' }}>
                {ret.initiated_at}
              </div>
            </div>
          </div>

          {/* Item details & Reason */}
          <div className="detail-item">
            <div className="detail-label">Customer Stated Reason & Evidence</div>
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '8px' }}>
              <strong>Code:</strong> {ret.reason_code} — "{item?.return_reason || 'N/A'}"
            </div>
            {item?.evidence_urls && item.evidence_urls.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Attached Proof Images
                </div>
                <div className="evidence-thumb-row">
                  {item.evidence_urls.map((url, idx) => (
                    <img key={idx} src={url} alt="Evidence" className="evidence-img-thumb" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logistics Pickup Section */}
          {pickup && (
            <div className="detail-item">
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} color="#38bdf8" />
                <span>Reverse Logistics & Pickup ({pickup.logistics_partner})</span>
              </div>
              <div className="details-grid" style={{ marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tracking AWB:</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                    {pickup.awb_number || 'Awaiting dispatch'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pickup Date & Slot:</div>
                  <div style={{ fontWeight: 600 }}>{pickup.pickup_date} ({pickup.pickup_slot})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Assigned Agent:</div>
                  <div>{pickup.agent_name} ({pickup.agent_phone})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Handover OTP:</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: 700 }}>
                    {pickup.pickup_otp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QC Appraisal result */}
          {qc ? (
            <div className="detail-item" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                <CheckCircle2 size={14} />
                <span>Warehouse QC Appraisal ({qc.qc_id})</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong>Grade:</strong> {qc.condition_grade} • <strong>Functional Test:</strong> {qc.functional_test} • <strong>Disposition:</strong> {qc.disposition}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                {qc.notes} (Inspected by {qc.inspector_id} at {qc.inspected_at})
              </div>
            </div>
          ) : (
            <div className="detail-item" style={{ borderLeft: '3px solid #f59e0b' }}>
              <div className="detail-label" style={{ color: '#f59e0b' }}>Warehouse QC Pending</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Awaiting physical receipt and barcode scan at Bay 4 warehouse.
              </div>
            </div>
          )}

          {/* Refund Settlement */}
          {refund && (
            <div className="detail-item" style={{ borderLeft: '3px solid #38bdf8' }}>
              <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="#38bdf8" />
                <span>Refund Settlement ({refund.refund_id})</span>
              </div>
              <div className="details-grid" style={{ marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Disbursement Amount:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                    ${refund.amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Payout Status:</div>
                  <span className={`badge ${refund.status === 'CREDITED' ? 'badge-green' : 'badge-amber'}`}>
                    {refund.status}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Method / Channel:</div>
                  <div>{refund.payment_channel || refund.method}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Razorpay Payout Ref:</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {refund.razorpay_refund_id || 'Pending gateway call'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
