import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Package,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  CreditCard,
  Truck,
  ShieldCheck
} from 'lucide-react';
import './InitiateReturn.css';

export const InitiateReturn = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { orders, initiateReturn, showToast } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.orderId || 'ORD-98721');
  const [selectedLineId, setSelectedLineId] = useState(orders[0]?.items[0]?.orderLineId || 'OL-5512');
  const [returnType, setReturnType] = useState('RETURN'); // RETURN or EXCHANGE
  const [reasonCode, setReasonCode] = useState('damaged_in_transit');
  const [reasonDetail, setReasonDetail] = useState('Damaged during shipping (screen cracked or casing dented)');
  const [uploadedImages, setUploadedImages] = useState([
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80'
  ]);
  const [refundMethod, setRefundMethod] = useState('ORIGINAL');
  const [pickupDate, setPickupDate] = useState('2026-07-28');
  const [pickupSlot, setPickupSlot] = useState('10:00 AM - 01:00 PM');
  const [logisticsPartner, setLogisticsPartner] = useState('DELHIVERY');

  // Currently selected order object
  const currentOrder = orders.find(o => o.orderId === selectedOrderId) || orders[0];
  const currentItem = currentOrder?.items.find(i => i.orderLineId === selectedLineId) || currentOrder?.items[0];

  const handleOrderChange = (orderId) => {
    setSelectedOrderId(orderId);
    const ord = orders.find(o => o.orderId === orderId);
    if (ord && ord.items.length > 0) {
      setSelectedLineId(ord.items[0].orderLineId);
    }
  };

  const handleSimulateUpload = () => {
    // Add demo proof image
    const sampleImages = [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80'
    ];
    const picked = sampleImages[uploadedImages.length % sampleImages.length];
    setUploadedImages([...uploadedImages, picked]);
    showToast('Evidence photo uploaded successfully');
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, idx) => idx !== index));
  };

  const handleSubmitReturn = () => {
    const returnId = initiateReturn({
      orderId: selectedOrderId,
      customerId: currentUser?.customerId || currentUser?.userId || currentUser?.id || '6ca2cf91-3d10-4964-898a-c789fbd4d91c',
      customerName: currentUser?.name || 'Karthik',
      productName: currentItem?.name || 'Enterprise Wireless Keyboard',
      price: currentItem?.price || 120,
      returnType: returnType,
      reasonCode: reasonCode,
      returnReasonDetail: reasonDetail,
      preferredRefundMethod: refundMethod,
      evidenceUrls: uploadedImages,
      pickupDate: pickupDate,
      pickupSlot: pickupSlot,
      logisticsPartner: logisticsPartner
    });

    if (onComplete) onComplete(returnId);
  };

  return (
    <div className="initiate-return-page">
      <div className="wizard-card">
        <h2 className="wizard-title">Initiate Refund / Return Request</h2>

        {/* Stepper Header matching Screenshot 3 & 4 */}
        <div className="stepper-nav">
          <div className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <div className="step-number-circle">
              {step > 1 ? <CheckCircle2 size={18} /> : 1}
            </div>
            <span className="step-title">1. Order & Product</span>
          </div>

          <div className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <div className="step-number-circle">
              {step > 2 ? <CheckCircle2 size={18} /> : 2}
            </div>
            <span className="step-title">2. Reason & Media</span>
          </div>

          <div className={`step-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
            <div className="step-number-circle">
              {step > 3 ? <CheckCircle2 size={18} /> : 3}
            </div>
            <span className="step-title">3. Method & Logistics</span>
          </div>

          <div className={`step-item ${step === 4 ? 'active' : ''}`}>
            <div className="step-number-circle">4</div>
            <span className="step-title">4. Review & Confirm</span>
          </div>
        </div>

        {/* STEP 1: ORDER & PRODUCT SELECTION (Screenshot 3) */}
        {step === 1 && (
          <div>
            <div className="form-group">
              <label className="form-label">Select Order Reference</label>
              <select
                className="form-select"
                value={selectedOrderId}
                onChange={(e) => handleOrderChange(e.target.value)}
              >
                {orders.map((ord) => (
                  <option key={ord.orderId} value={ord.orderId}>
                    {ord.orderId} — {ord.items.map(i => i.name).join(', ')} (${ord.items.reduce((s, i) => s + i.price, 0).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected item card */}
            {currentItem && (
              <div className="order-item-card">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="order-item-thumb"
                />
                <div className="order-item-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{currentItem.name}</h4>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
                      ${currentItem.price.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    SKU: {currentItem.skuId} • Category: {currentItem.category} • Quantity: {currentItem.quantity}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className="badge badge-green">✓ Eligible for Return</span>
                    <span className="badge badge-neutral">Delivered: {currentOrder.deliveryDate}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="wizard-button-row">
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Window: 7 days electronics, 30 days apparel
              </div>
              <button className="btn-primary" onClick={() => setStep(2)}>
                <span>Continue to Reason & Media</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REASON & MEDIA UPLOAD (Screenshot 4) */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label">Return Action Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  className={`detail-item ${returnType === 'RETURN' ? 'badge-blue' : ''}`}
                  style={{ cursor: 'pointer', padding: '14px', border: returnType === 'RETURN' ? '1px solid #38bdf8' : '1px solid #233454' }}
                  onClick={() => setReturnType('RETURN')}
                >
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>Return for Full Refund</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Original payment, store credit, or bank transfer</div>
                </div>
                <div
                  className={`detail-item ${returnType === 'EXCHANGE' ? 'badge-blue' : ''}`}
                  style={{ cursor: 'pointer', padding: '14px', border: returnType === 'EXCHANGE' ? '1px solid #38bdf8' : '1px solid #233454' }}
                  onClick={() => setReturnType('EXCHANGE')}
                >
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>Exchange for Replacement</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Replacement dispatch upon return pickup</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Return</label>
              <select
                className="form-select"
                value={reasonCode}
                onChange={(e) => {
                  setReasonCode(e.target.value);
                  if (e.target.value === 'damaged_in_transit') {
                    setReasonDetail('Damaged during shipping (screen cracked or casing dented)');
                  } else if (e.target.value === 'defective') {
                    setReasonDetail('Hardware defect / not powering on as expected');
                  } else if (e.target.value === 'wrong_item') {
                    setReasonDetail('Received item does not match website specifications/photos');
                  } else if (e.target.value === 'size_fit_issue') {
                    setReasonDetail('Size or dimensions do not fit requirements');
                  } else {
                    setReasonDetail('Changed mind / no longer needed');
                  }
                }}
              >
                <option value="damaged_in_transit">Damaged during shipping</option>
                <option value="defective">Defective / Hardware failure</option>
                <option value="wrong_item">Wrong item received</option>
                <option value="size_fit_issue">Size / fit issue</option>
                <option value="changed_mind">Changed mind / No longer needed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Specific Details / Fault Description</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={reasonDetail}
                onChange={(e) => setReasonDetail(e.target.value)}
                placeholder="Describe what is wrong or why you wish to return/exchange..."
              />
            </div>

            {/* Drag & Drop Upload Zone matching Screenshot 4 */}
            <div className="form-group">
              <label className="form-label">Upload Proof Image (Required for Damage / Defect Claims)</label>
              <div className="upload-dropzone" onClick={handleSimulateUpload}>
                <UploadCloud size={36} color="#38bdf8" style={{ marginBottom: '10px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                  Click or drop files to upload device images
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Supports JPG, PNG, WEBP (Max 10MB) • Private S3 Vault Storage
                </span>
              </div>

              {uploadedImages.length > 0 && (
                <div className="uploaded-preview-grid">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="preview-box">
                      <img src={img} alt="Evidence preview" />
                      <button
                        type="button"
                        className="preview-delete-btn"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="wizard-button-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                <span>Continue to Method & Logistics</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: METHOD & LOGISTICS */}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label className="form-label">Preferred Refund Settlement Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div
                  className={`detail-item ${refundMethod === 'ORIGINAL' ? 'badge-blue' : ''}`}
                  style={{ cursor: 'pointer', border: refundMethod === 'ORIGINAL' ? '1px solid #38bdf8' : '1px solid #233454' }}
                  onClick={() => setRefundMethod('ORIGINAL')}
                >
                  <div style={{ fontWeight: 600, color: '#fff' }}>Original Method</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>5-7 business days SLA</div>
                </div>

                <div
                  className={`detail-item ${refundMethod === 'STORE_CREDIT' ? 'badge-blue' : ''}`}
                  style={{ cursor: 'pointer', border: refundMethod === 'STORE_CREDIT' ? '1px solid #38bdf8' : '1px solid #233454' }}
                  onClick={() => setRefundMethod('STORE_CREDIT')}
                >
                  <div style={{ fontWeight: 600, color: '#34d399' }}>Store Credit (+5%)</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Instant wallet credit</div>
                </div>

                <div
                  className={`detail-item ${refundMethod === 'BANK_TRANSFER' ? 'badge-blue' : ''}`}
                  style={{ cursor: 'pointer', border: refundMethod === 'BANK_TRANSFER' ? '1px solid #38bdf8' : '1px solid #233454' }}
                  onClick={() => setRefundMethod('BANK_TRANSFER')}
                >
                  <div style={{ fontWeight: 600, color: '#fff' }}>Bank Transfer (NEFT)</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Required for COD</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Preferred Pickup Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logistics Time Slot</label>
                <select
                  className="form-select"
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                >
                  <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="06:00 PM - 09:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reverse Logistics Partner</label>
              <select
                className="form-select"
                value={logisticsPartner}
                onChange={(e) => setLogisticsPartner(e.target.value)}
              >
                <option value="DELHIVERY">Delhivery Reverse Logistics (Recommended)</option>
                <option value="SHIPROCKET">Shiprocket Express Reverse</option>
              </select>
            </div>

            <div className="wizard-button-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button className="btn-primary" onClick={() => setStep(4)}>
                <span>Review & Submit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div>
            <div className="surface-card" style={{ background: '#0d1525', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '14px' }}>
                Review Return Summary
              </h4>

              <div className="details-grid">
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>PRODUCT TO RETURN</div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{currentItem?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Order: {selectedOrderId}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SETTLEMENT VALUE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                    ${currentItem?.price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Method: {refundMethod}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>REASON & TYPE</div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{returnType} — {reasonCode}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{reasonDetail}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SCHEDULED PICKUP</div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{pickupDate} ({pickupSlot})</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Carrier: {logisticsPartner}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#10b981', marginBottom: '16px' }}>
              <ShieldCheck size={16} />
              <span>Consumer Protection Act: Instant reverse AWB tracking & SMS OTP verification provided.</span>
            </div>

            <div className="wizard-button-row">
              <button className="btn-secondary" onClick={() => setStep(3)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button className="btn-primary" onClick={handleSubmitReturn}>
                <CheckCircle2 size={16} />
                <span>Submit Return Request</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
