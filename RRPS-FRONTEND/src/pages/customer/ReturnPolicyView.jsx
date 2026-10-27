import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, BookOpen, CheckCircle, Clock, Award, HelpCircle } from 'lucide-react';
import './ReturnPolicyView.css';

export const ReturnPolicyView = () => {
  const { policies } = useApp();

  return (
    <div className="policy-view-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Standard Return & Refund Policies
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Configured return windows, inspection protocols, and consumer protection entitlements (Consumer Protection Rules 2020).
        </p>
      </div>

      <div className="policy-cards-grid">
        {policies.map((pol) => (
          <div key={pol.policy_id} className="policy-detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-blue">{pol.entity_type}</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {pol.policy_id}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>
              {pol.category_name}
            </h3>

            <div className="policy-window-badge">
              {pol.return_window_days}
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>days window</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color={pol.free_return ? '#10b981' : '#64748b'} />
                <span>Free Return Shipping: {pol.free_return ? 'Included (Seller pays)' : 'Customer pays / deduction'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={15} color={pol.exchange_eligible ? '#10b981' : '#64748b'} />
                <span>One-time Size Exchange: {pol.exchange_eligible ? 'Permitted' : 'Not permitted'}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.45 }}>
              {pol.rules}
            </p>
          </div>
        ))}
      </div>

      <div className="surface-card" style={{ marginTop: '10px' }}>
        <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="#f59e0b" />
          <span>Non-Returnable Items & Exceptions (FR1 / Appendix C)</span>
        </h4>
        <ul style={{ paddingLeft: '20px', fontSize: '0.84rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong>Perishables & Consumables:</strong> Packaged foods, gourmet items, health supplements cannot be returned once delivered.</li>
          <li><strong>Digital Goods & Software Licenses:</strong> Downloadable products and pre-activated keys cannot be returned or refunded.</li>
          <li><strong>Intimate Apparel & Personal Hygiene:</strong> Swimwear and undergarments are non-returnable once opened.</li>
          <li><strong>Customized & Engraved Items:</strong> Tailored products manufactured to customer specifications are final sale.</li>
        </ul>
      </div>
    </div>
  );
};
