import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Edit2, CheckCircle, Plus, Shield } from 'lucide-react';
import './PolicyEngine.css';

export const PolicyEngine = () => {
  const { policies, updatePolicy, showToast } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [editDays, setEditDays] = useState(7);
  const [editFreeReturn, setEditFreeReturn] = useState(false);

  const startEdit = (policy) => {
    setEditingId(policy.policy_id);
    setEditDays(policy.return_window_days);
    setEditFreeReturn(policy.free_return);
  };

  const saveEdit = (policyId) => {
    updatePolicy(policyId, {
      return_window_days: Number(editDays),
      free_return: editFreeReturn
    });
    setEditingId(null);
  };

  return (
    <div className="policy-engine-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Return Policy Engine Configuration (FR1)
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Configure category-level return windows, free return freight rules, and exchange eligibility.
        </p>
      </div>

      <div className="policy-table-box">
        <div style={{ overflowX: 'auto' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Scope Entity</th>
                <th>Target Category</th>
                <th>Return Window</th>
                <th>Free Return</th>
                <th>Exchange Eligible</th>
                <th>Effective From</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.policy_id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                    {p.policy_id}
                  </td>
                  <td>
                    <span className="badge badge-blue">{p.entity_type}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>
                    {p.category_name}
                  </td>
                  <td>
                    {editingId === p.policy_id ? (
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '70px', padding: '4px 8px' }}
                        value={editDays}
                        onChange={(e) => setEditDays(e.target.value)}
                        min="1"
                        max="90"
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{p.return_window_days} Days</span>
                    )}
                  </td>
                  <td>
                    {editingId === p.policy_id ? (
                      <input
                        type="checkbox"
                        checked={editFreeReturn}
                        onChange={(e) => setEditFreeReturn(e.target.checked)}
                      />
                    ) : (
                      <span className={`badge ${p.free_return ? 'badge-green' : 'badge-neutral'}`}>
                        {p.free_return ? 'YES' : 'NO'}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${p.exchange_eligible ? 'badge-green' : 'badge-rose'}`}>
                      {p.exchange_eligible ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    {p.effective_from}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {editingId === p.policy_id ? (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                        onClick={() => saveEdit(p.policy_id)}
                      >
                        <CheckCircle size={13} />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                        onClick={() => startEdit(p)}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
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
