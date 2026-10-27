import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertOctagon, CheckCircle, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';
import './FraudQueue.css';

export const FraudQueue = () => {
  const { fraudFlags, resolveFraudFlag } = useApp();

  return (
    <div className="fraud-page">
      {/* Alert Header matching Screenshot 15 */}
      <div className="fraud-banner-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
              Fraud Alert & High-Risk Quarantine
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
              Potentially suspicious serials, excessive velocities or duplicate returns.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-rose" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            {fraudFlags.filter(f => f.status !== 'CLEARED').length} Quarantine Holds
          </span>
        </div>
      </div>

      {/* Fraud Quarantine Table matching Screenshot 15 */}
      <div className="data-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Customer / Account</th>
                <th>Risk Score</th>
                <th>Trigger Condition</th>
                <th>Flag Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fraudFlags.map((flag) => (
                <tr key={flag.flag_id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                    {flag.return_id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{flag.customer_name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{flag.customer_id}</div>
                  </td>
                  <td>
                    {flag.risk_score.includes('High') ? (
                      <span className="risk-badge-high">
                        <AlertOctagon size={13} />
                        <span>{flag.risk_score}</span>
                      </span>
                    ) : (
                      <span className="risk-badge-med">
                        <AlertTriangle size={13} />
                        <span>{flag.risk_score}</span>
                      </span>
                    )}
                  </td>
                  <td style={{ color: '#e2e8f0', maxWidth: '300px' }}>
                    {flag.trigger_condition}
                  </td>
                  <td>
                    <span className={`badge ${flag.status === 'CLEARED' ? 'badge-green' : flag.status === 'CONFIRMED' ? 'badge-rose' : 'badge-amber'}`}>
                      {flag.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {flag.status === 'CLEARED' ? (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} />
                        <span>Cleared by Compliance</span>
                      </span>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-danger"
                          style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                          onClick={() => resolveFraudFlag(flag.flag_id, 'CONFIRMED', 'Blacklisted account')}
                        >
                          <UserX size={13} />
                          <span>Investigate & Flag User</span>
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                          onClick={() => resolveFraudFlag(flag.flag_id, 'CLEARED', 'Verified receipt')}
                        >
                          <span>Clear Flag</span>
                        </button>
                      </div>
                    )}
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
