import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, X, Camera, Scan, CheckCircle, ArrowRight } from 'lucide-react';
import './BarcodeScannerModal.css';

export const BarcodeScannerModal = ({ isOpen, onClose, onSelectBarcode }) => {
  const { returnRequests } = useApp();
  const [manualCode, setManualCode] = useState('');

  if (!isOpen) return null;

  // Filter returns needing inspection (not already refunded)
  const availableToScan = returnRequests.filter(
    r => r.status !== 'REFUNDED' && r.status !== 'CLOSED'
  );

  const handleScanCode = (code) => {
    onSelectBarcode(code);
    onClose();
  };

  return (
    <div className="scanner-modal-backdrop" onClick={onClose}>
      <div className="scanner-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="scanner-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scan size={18} color="white" />
            </div>
            <h3 className="scanner-modal-title">Simulated Barcode Scanner UI</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder exactly matching Screenshot 10 */}
        <div className="viewfinder-container">
          <div className="viewfinder-corner corner-tl" />
          <div className="viewfinder-corner corner-tr" />
          <div className="viewfinder-corner corner-bl" />
          <div className="viewfinder-corner corner-br" />

          <div className="scanner-laser" />

          <div className="viewfinder-label">
            <Camera size={26} color="#38bdf8" />
            <span>Align package barcode tag within frame</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Simulating real-time video stream (QC Tablet API)</span>
          </div>
        </div>

        {/* Quick Pick barcodes from warehouse receivables */}
        <div className="barcode-picker-row">
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
            Available Warehouse Packages to Scan:
          </div>
          <div className="scanner-quick-pills">
            {availableToScan.slice(0, 4).map((r) => (
              <button
                key={r.return_id}
                className="quick-scan-pill"
                onClick={() => handleScanCode(r.return_id)}
                title={`Scan ${r.product_name}`}
              >
                <QrCode size={13} color="#38bdf8" />
                <span>{r.return_id} ({r.product_name.substring(0, 16)}...)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Barcode Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Or type Return ID (e.g. RET-9001)..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
          />
          <button
            className="btn-primary"
            disabled={!manualCode.trim()}
            onClick={() => handleScanCode(manualCode.trim())}
          >
            <span>Scan Tag</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
