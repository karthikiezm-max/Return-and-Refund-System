import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, ShieldCheck } from 'lucide-react';
import './QCAppraisalForm.css';

export const QCAppraisalForm = ({ initialReturnId, onSubmitted }) => {
  const { returnRequests, submitQCInspection } = useApp();

  const [selectedReturnId, setSelectedReturnId] = useState(initialReturnId || (returnRequests[0]?.return_id || ''));
  const [conditionGrade, setConditionGrade] = useState('MINT');
  const [powerOn, setPowerOn] = useState(true);
  const [displayAudio, setDisplayAudio] = useState(true);
  const [interfacesOk, setInterfacesOk] = useState(true);
  const [complaintValidated, setComplaintValidated] = useState(true);
  const [disposition, setDisposition] = useState('RESTOCK_NEW');
  const [notes, setNotes] = useState('Passed standard warehouse intake quality control.');

  useEffect(() => {
    if (initialReturnId) {
      setSelectedReturnId(initialReturnId);
    } else if (returnRequests.length > 0 && (!selectedReturnId || !returnRequests.some(r => r.return_id === selectedReturnId))) {
      setSelectedReturnId(returnRequests[0].return_id);
    }
  }, [initialReturnId, returnRequests, selectedReturnId]);

  const currentReturn = returnRequests.find(r => r.return_id === selectedReturnId) || returnRequests[0];

  const handleGradeChange = (grade) => {
    setConditionGrade(grade);
    if (grade === 'MINT') {
      setDisposition('RESTOCK_NEW');
      setPowerOn(true);
      setDisplayAudio(true);
      setInterfacesOk(true);
      setNotes('Factory seal intact / no cosmetic wear. Passed full diagnostic suite.');
    } else if (grade === 'GOOD') {
      setDisposition('RESTOCK_REFURB');
      setPowerOn(true);
      setDisplayAudio(true);
      setInterfacesOk(true);
      setNotes('Minor cosmetic wear / opened packaging. Certified Refurbished eligible.');
    } else if (grade === 'FAIR') {
      setDisposition('LIQUIDATE');
      setNotes('Heavy cosmetic blemishes, functional. Route to weekly liquidation lot.');
    } else {
      setDisposition('DISPOSE');
      setPowerOn(false);
      setDisplayAudio(false);
      setNotes('Severe physical damage or manufacturing defect.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const targetId = selectedReturnId || (currentReturn ? currentReturn.return_id : '');
    if (!targetId) {
      return;
    }

    const functionalTest = (powerOn && displayAudio && interfacesOk) ? 'PASS' : 'FAIL';

    await submitQCInspection({
      returnId: targetId,
      inspectorId: 'INS-551',
      conditionGrade,
      functionalTest,
      complaintValidated,
      disposition,
      notes,
      images: "[]"
    });

    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="appraisal-page">
      <div className="appraisal-card">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <CheckSquare size={20} />
          </div>
          <h2 className="appraisal-title" style={{ marginBottom: 0 }}>
            Quality Control Appraisal Form
          </h2>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '24px' }}>
          Standardized warehouse reverse triage, physical condition grading, and disposition routing.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Package Barcode */}
          <div className="form-group">
            <label className="form-label">Package Barcode (Return ID)</label>
            <select
              className="form-select"
              value={selectedReturnId}
              onChange={(e) => {
                setSelectedReturnId(e.target.value);
              }}
            >
              {returnRequests.map((r) => (
                <option key={r.return_id} value={r.return_id}>
                  {r.return_id} — {r.product_name} (${r.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {currentReturn && (
            <div className="surface-card" style={{ background: '#0a101d', border: '1px solid #1c2b48', padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Item: </span>
                  <strong style={{ color: '#ffffff' }}>{currentReturn.product_name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Customer Stated Reason: </span>
                  <span style={{ color: '#f59e0b' }}>{currentReturn.reason_code}</span>
                </div>
              </div>
            </div>
          )}

          {/* Condition Grade */}
          <div className="form-group">
            <label className="form-label">Condition Grade</label>
            <select
              className="form-select"
              value={conditionGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
            >
              <option value="MINT">A - Mint (Resellable as new, factory seal intact)</option>
              <option value="GOOD">B - Minor Wear (Scratches or packaging open - Refurb)</option>
              <option value="FAIR">C - Fair (Heavy wear / cosmetic blemish - Liquidation)</option>
              <option value="DAMAGED">D - Damaged / Unusable (Impact / water damage)</option>
            </select>
          </div>

          {/* Functional Checklist */}
          <div className="form-group">
            <label className="form-label">Functional Checklist</label>
            <div className="checklist-group">
              <label className="check-item">
                <input
                  type="checkbox"
                  checked={powerOn}
                  onChange={(e) => setPowerOn(e.target.checked)}
                />
                <span>Powers On (Mainboard circuitry & battery test)</span>
              </label>

              <label className="check-item">
                <input
                  type="checkbox"
                  checked={displayAudio}
                  onChange={(e) => setDisplayAudio(e.target.checked)}
                />
                <span>Display / Audio Active (Visual & acoustic drivers)</span>
              </label>

              <label className="check-item">
                <input
                  type="checkbox"
                  checked={interfacesOk}
                  onChange={(e) => setInterfacesOk(e.target.checked)}
                />
                <span>Input Interfaces Click / Respond (Ports, keys, tactile feedback)</span>
              </label>
            </div>
          </div>

          {/* Complaint Validated */}
          <div className="form-group">
            <label className="form-label">Customer Stated Complaint Validated?</label>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                type="button"
                className={`btn-secondary ${complaintValidated ? 'btn-primary' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setComplaintValidated(true)}
              >
                Yes (Condition matches customer claim)
              </button>
              <button
                type="button"
                className={`btn-secondary ${!complaintValidated ? 'btn-danger' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setComplaintValidated(false)}
              >
                No / Mismatch (Potential Fraud Alert)
              </button>
            </div>
          </div>

          {/* Disposition Decision */}
          <div className="form-group">
            <label className="form-label">Disposition Decision</label>
            <select
              className="form-select"
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
            >
              <option value="RESTOCK_NEW">Restock to Inventory (New SKU)</option>
              <option value="RESTOCK_REFURB">Restock to Inventory (Certified Refurbished)</option>
              <option value="LIQUIDATE">Route to Heavy Discount Liquidation Lot</option>
              <option value="RTM">Repair to Manufacturer (Supplier Credit / RTM)</option>
              <option value="DISPOSE">Scrap / Heavy Damage Disposal</option>
            </select>
          </div>

          {/* Inspector Notes */}
          <div className="form-group">
            <label className="form-label">Inspector Technical Notes & Diagnostics</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record diagnostic codes or visible defects..."
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '0.95rem' }}>
            <ShieldCheck size={18} />
            <span>Submit Inspection & Release to Settlement</span>
          </button>
        </form>
      </div>
    </div>
  );
};
