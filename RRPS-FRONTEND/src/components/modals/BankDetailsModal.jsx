import React from 'react';
import { X, Building2, CheckCircle, Shield } from 'lucide-react';
import './BankDetailsModal.css';

export const BankDetailsModal = ({ isOpen, onClose, refund, onApprove }) => {
  if (!isOpen || !refund) return null;

  return (
    <div className="bank-modal-backdrop" onClick={onClose}>
      <div className="bank-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="bank-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} color="white" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              NEFT / COD Payout Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bank-detail-card">
          <div className="bank-field-row">
            <span className="bank-field-name">Customer:</span>
            <span className="bank-field-val">{refund.customer_name}</span>
          </div>
          <div className="bank-field-row">
            <span className="bank-field-name">Disbursement Amount:</span>
            <span className="bank-field-val" style={{ color: '#34d399', fontSize: '1rem' }}>
              ${refund.amount?.toFixed(2)}
            </span>
          </div>
          <div className="bank-field-row">
            <span className="bank-field-name">Bank Institution:</span>
            <span className="bank-field-val">HDFC Bank Ltd.</span>
          </div>
          <div className="bank-field-row">
            <span className="bank-field-name">IFSC Code:</span>
            <span className="bank-field-val">HDFC0001298</span>
          </div>
          <div className="bank-field-row">
            <span className="bank-field-name">Account Number:</span>
            <span className="bank-field-val">•••• •••• •••• 9821</span>
          </div>
          <div className="bank-field-row">
            <span className="bank-field-name">Account Type:</span>
            <span className="bank-field-val">Savings Account</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#10b981' }}>
          <Shield size={14} />
          <span>NPCI Account Validation Passed • Beneficiary Name Matches Order Profile</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1.5 }}
            onClick={() => {
              onApprove(refund.refund_id);
              onClose();
            }}
          >
            <CheckCircle size={16} />
            <span>Disburse NEFT Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
