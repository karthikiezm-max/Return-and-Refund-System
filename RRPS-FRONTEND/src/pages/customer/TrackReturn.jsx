import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Repeat
} from 'lucide-react';
import './TrackReturn.css';

export const TrackReturn = ({ initialReturnId }) => {
  const { returnRequests, returnItems, pickups, qcInspections, refunds, reschedulePickup, showToast } = useApp();

  const [activeReturnId, setActiveReturnId] = useState(initialReturnId || 'RET-9002');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('2026-07-29');
  const [newSlot, setNewSlot] = useState('02:00 PM - 05:00 PM');

  const currentReturn = returnRequests.find(r => r.return_id === activeReturnId) || returnRequests[0];
  const currentItem = returnItems.find(i => i.return_id === currentReturn?.return_id);
  const currentPickup = pickups.find(p => p.return_id === currentReturn?.return_id);
  const currentQc = qcInspections.find(q => q.return_id === currentReturn?.return_id);
  const currentRefund = refunds.find(rf => rf.return_id === currentReturn?.return_id);

  // Status index for milestone stepper: 1 to 5
  const getMilestoneIndex = (status) => {
    switch (status) {
      case 'INITIATED': return 1;
      case 'PICKUP_SCHEDULED': return 2;
      case 'IN_TRANSIT':
      case 'RECEIVED': return 3;
      case 'QC_IN_PROGRESS':
      case 'QC_DONE': return 4;
      case 'REFUND_INITIATED':
      case 'REFUNDED':
      case 'EXCHANGE_DISPATCHED':
      case 'CLOSED': return 5;
      default: return 1;
    }
  };

  const currentIndex = getMilestoneIndex(currentReturn?.status);

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    reschedulePickup(currentReturn.return_id, newDate, newSlot);
    setShowRescheduleModal(false);
  };

  return (
    <div className="track-return-page">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Track Active Return
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Select a return ID to display its tracking status timeline:
        </p>
      </div>

      {/* Quick Tabs matching Screenshot 6 */}
      <div className="track-selector-bar">
        {returnRequests.map((r) => (
          <button
            key={r.return_id}
            className={`track-pill-tab ${activeReturnId === r.return_id ? 'active' : ''}`}
            onClick={() => setActiveReturnId(r.return_id)}
          >
            {r.return_id} ({r.status.replace('_', ' ')})
          </button>
        ))}
      </div>

      {currentReturn && (
        <div className="track-content-grid">
          {/* Left: Item Details matching Screenshot 6 */}
          <div className="item-details-box">
            <h3 className="item-details-title">Item Details</h3>

            <div className="detail-row">
              <span className="detail-row-label">Return ID:</span>
              <span className="detail-row-value" style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                {currentReturn.return_id}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-row-label">Product:</span>
              <span className="detail-row-value" style={{ fontWeight: 600 }}>
                {currentReturn.product_name} (${currentReturn.price.toFixed(2)})
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-row-label">Reason:</span>
              <span className="detail-row-value">
                {currentReturn.reason_code} — {currentItem?.return_reason}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-row-label">Refund / Settlement:</span>
              <span className="detail-row-value" style={{ color: '#34d399', fontWeight: 600 }}>
                {currentReturn.preferred_refund_method}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-row-label">Pickup Address:</span>
              <span className="detail-row-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#f43f5e" />
                <span>406 Tech Blvd, San Francisco, CA</span>
              </span>
            </div>

            {currentPickup && (
              <>
                <div className="detail-row">
                  <span className="detail-row-label">Logistics Carrier & AWB:</span>
                  <span className="detail-row-value" style={{ fontFamily: 'var(--font-mono)' }}>
                    {currentPickup.logistics_partner} • {currentPickup.awb_number || 'Awaiting dispatch'}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-row-label">Pickup OTP (Share with driver):</span>
                  <span className="detail-row-value" style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24', fontSize: '1.15rem', fontWeight: 800 }}>
                    {currentPickup.pickup_otp}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-row-label">Assigned Agent:</span>
                  <span className="detail-row-value">
                    {currentPickup.agent_name} ({currentPickup.agent_phone})
                  </span>
                </div>

                {currentReturn.status === 'PICKUP_SCHEDULED' && (
                  <button
                    className="btn-secondary"
                    style={{ marginTop: '10px', fontSize: '0.8rem' }}
                    onClick={() => setShowRescheduleModal(true)}
                  >
                    <Calendar size={14} />
                    <span>Reschedule Pickup (Max 2 Allowed)</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right: Milestone Stepper Timeline matching Screenshot 6 */}
          <div className="milestone-timeline-box">
            <h3 className="item-details-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Milestone Progress</span>
              <span className="badge badge-blue">
                Step {currentIndex} of 5
              </span>
            </h3>

            <div className="timeline-list">
              {/* Milestone 1 */}
              <div className={`timeline-step ${currentIndex >= 1 ? 'completed' : ''}`}>
                <div className="step-marker">
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-content">
                  <h4 className="step-name">Return Initiated</h4>
                  <p className="step-desc">
                    Customer filed return request with reason and verification proof. Return window validated.
                  </p>
                  <div className="step-timestamp">{currentReturn.initiated_at}</div>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className={`timeline-step ${currentIndex > 2 ? 'completed' : currentIndex === 2 ? 'current' : ''}`}>
                <div className="step-marker">
                  <Truck size={16} />
                </div>
                <div className="step-content">
                  <h4 className="step-name">Pickup Scheduled</h4>
                  <p className="step-desc">
                    Reverse pickup slot booked with {currentPickup?.logistics_partner || 'carrier'}. Driver assigned with OTP verification.
                  </p>
                  <div className="step-timestamp">
                    {currentPickup ? `${currentPickup.pickup_date} (${currentPickup.pickup_slot})` : 'Pending schedule'}
                  </div>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className={`timeline-step ${currentIndex > 3 ? 'completed' : currentIndex === 3 ? 'current' : ''}`}>
                <div className="step-marker">
                  <Clock size={16} />
                </div>
                <div className="step-content">
                  <h4 className="step-name">In-Transit / Hub Received</h4>
                  <p className="step-desc">
                    Item picked up by courier and in transit to regional fulfillment reverse logistics center.
                  </p>
                  <div className="step-timestamp">
                    {currentPickup?.awb_number ? `AWB: ${currentPickup.awb_number}` : 'Awaiting transit'}
                  </div>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className={`timeline-step ${currentIndex > 4 ? 'completed' : currentIndex === 4 ? 'current' : ''}`}>
                <div className="step-marker">
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-content">
                  <h4 className="step-name">QC Inspection at Warehouse</h4>
                  <p className="step-desc">
                    Warehouse staff barcode scan and physical appraisal (Mint / Good / Fair / Damaged).
                  </p>
                  <div className="step-timestamp">
                    {currentQc ? `Graded: ${currentQc.condition_grade} (${currentQc.disposition}) at ${currentQc.inspected_at}` : 'Inspection SLA: 24 business hours'}
                  </div>
                </div>
              </div>

              {/* Milestone 5 */}
              <div className={`timeline-step ${currentIndex === 5 ? 'completed' : ''}`}>
                <div className="step-marker">
                  <ShieldCheck size={16} />
                </div>
                <div className="step-content">
                  <h4 className="step-name">Refund Processed / Replacement Sent</h4>
                  <p className="step-desc">
                    Settlement disbursed to original payment method, store credit wallet, or replacement AWB generated.
                  </p>
                  <div className="step-timestamp">
                    {currentRefund ? `${currentRefund.status} — $${currentRefund.amount.toFixed(2)} (${currentRefund.payment_channel})` : 'Pending QC completion'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="details-modal-backdrop" onClick={() => setShowRescheduleModal(false)}>
          <div className="details-modal-box" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h4 style={{ color: '#fff', fontSize: '1rem' }}>Reschedule Reverse Pickup</h4>
            </div>
            <form onSubmit={handleRescheduleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">New Pickup Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Time Slot</label>
                <select
                  className="form-select"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                >
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                  <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                </select>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                * Note: Under policy rules, a maximum of 2 reschedules are allowed.
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1.2 }}>
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
