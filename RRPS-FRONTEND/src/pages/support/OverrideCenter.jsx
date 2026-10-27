import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import './OverrideCenter.css';

export const OverrideCenter = () => {
  const { returnRequests, executeSupportOverride } = useApp();

  const [selectedReturnId, setSelectedReturnId] = useState(
    returnRequests.find(r => r.status !== 'REFUNDED')?.return_id || 'RET-9004'
  );
  const [newStatus, setNewStatus] = useState('REFUND_INITIATED');
  const [additionalDays, setAdditionalDays] = useState(7);
  const [reason, setReason] = useState('Customer loyalty tier override authorized by Shift Supervisor');

  const selectedReturn = returnRequests.find(r => r.return_id === selectedReturnId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    executeSupportOverride(selectedReturnId, newStatus, reason, Number(additionalDays));
  };

  return (
    <div className="override-page">
      <div className="override-card">
        {/* Title & Subtext matching Screenshot 8 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
            <Sliders size={20} />
          </div>
          <h2 className="override-title">Operational Override Center</h2>
        </div>
        <p className="override-subtext">
          Bypass strict barcode matches or QC guidelines to issue customer satisfaction refunds.
        </p>

        <form className="override-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Return ID Reference</label>
            <select
              className="form-select"
              value={selectedReturnId}
              onChange={(e) => setSelectedReturnId(e.target.value)}
            >
              {returnRequests.map((r) => (
                <option key={r.return_id} value={r.return_id}>
                  {r.return_id} — {r.product_name} (${r.price.toFixed(2)}) [{r.status}]
                </option>
              ))}
            </select>
          </div>

          {selectedReturn && (
            <div className="surface-card" style={{ background: '#0b1220', padding: '14px 18px', border: '1px solid #1e2d4a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Customer: </span>
                  <strong style={{ color: '#fff' }}>{selectedReturn.customer_name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Current Status: </span>
                  <span className="badge badge-amber">{selectedReturn.status}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Amount: </span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>${selectedReturn.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Force Status Override To:</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="REFUND_INITIATED">Refund Initiated (Pre-QC Approval)</option>
                <option value="QC_DONE">QC Done (Bypass Physical Check)</option>
                <option value="REFUNDED">Force Disbursed (Immediate Settlement)</option>
                <option value="EXCHANGE_DISPATCHED">Force Exchange Dispatched</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Support Extension Days (Max +7 Days per FR1)</label>
              <select
                className="form-select"
                value={additionalDays}
                onChange={(e) => setAdditionalDays(Number(e.target.value))}
              >
                <option value={3}>+3 Days Extension</option>
                <option value={5}>+5 Days Extension</option>
                <option value={7}>+7 Days Extension (Maximum Support Limit)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mandatory Override Justification / Reason</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for audit logging (e.g. VIP goodwill gesture, carrier delay compensation)..."
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#fb7185' }}>
            <AlertTriangle size={15} />
            <span>Audit Notice: All overrides are permanently recorded with your Agent ID in the compliance ledger.</span>
          </div>

          <button type="submit" className="override-btn">
            <Sliders size={18} />
            <span>Execute Override</span>
          </button>
        </form>
      </div>
    </div>
  );
};
