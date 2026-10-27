import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { SupportChatWidget } from '../components/common/SupportChatWidget';

// Pages
import { CustomerHome } from './customer/CustomerHome';
import { InitiateReturn } from './customer/InitiateReturn';
import { ReturnHistory } from './customer/ReturnHistory';
import { TrackReturn } from './customer/TrackReturn';
import { ReturnPolicyView } from './customer/ReturnPolicyView';
import { MyOrders } from './customer/MyOrders';

import { SupportDashboard } from './support/SupportDashboard';
import { OverrideCenter } from './support/OverrideCenter';

import { ReceivablesConsole } from './qc/ReceivablesConsole';
import { QCAppraisalForm } from './qc/QCAppraisalForm';

import { DisbursementDesk } from './finance/DisbursementDesk';
import { RTMManagement } from './supplier/RTMManagement';

import { AdminDashboard } from './admin/AdminDashboard';
import { FraudQueue } from './admin/FraudQueue';
import { AdminReports } from './admin/AdminReports';
import { PolicyEngine } from './admin/PolicyEngine';

import { BarcodeScannerModal } from '../components/modals/BarcodeScannerModal';
import { User, Settings, Bell, Shield } from 'lucide-react';
import './ReturnPlatform.css';

export const ReturnPlatform = ({ onOpenNotifs }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'customer';

  // Determine initial tab based on role
  const getDefaultTab = (currentRole) => {
    switch (currentRole) {
      case 'customer_support': return 'support_dashboard';
      case 'warehouse_qc': return 'qc_dashboard';
      case 'finance': return 'finance_dashboard';
      case 'supplier_manager': return 'supplier_dashboard';
      case 'admin': return 'admin_dashboard';
      default: return 'customer_home';
    }
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTab(role));
  const [trackTargetReturnId, setTrackTargetReturnId] = useState('RET-9002');
  const [qcInspectTargetReturnId, setQcInspectTargetReturnId] = useState('RET-9001');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // When role changes via passport, update active tab
  useEffect(() => {
    setActiveTab(getDefaultTab(role));
  }, [role]);

  const handleNavigateToTrack = (returnId) => {
    if (returnId) setTrackTargetReturnId(returnId);
    setActiveTab('customer_track');
  };

  const handleNavigateToAppraisal = (returnId) => {
    if (returnId) setQcInspectTargetReturnId(returnId);
    setActiveTab('qc_appraisal');
  };

  const handleTabSelect = (tabId) => {
    if (tabId === 'common_notifications') {
      if (onOpenNotifs) onOpenNotifs();
      return;
    }
    if (tabId === 'qc_scanner') {
      setIsScannerOpen(true);
      return;
    }
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      // Customer Portal Routes
      case 'customer_home':
        return <CustomerHome onNavigate={handleTabSelect} />;
      case 'customer_orders':
        return <MyOrders onInitiateReturn={() => setActiveTab('customer_initiate')} />;
      case 'customer_initiate':
        return <InitiateReturn onComplete={(newId) => handleNavigateToTrack(newId)} />;
      case 'customer_history':
        return <ReturnHistory onNavigateTrack={handleNavigateToTrack} />;
      case 'customer_exchanges':
        return <ReturnHistory filterType="EXCHANGE" onNavigateTrack={handleNavigateToTrack} />;
      case 'customer_refunds':
        return <CustomerHome initialView="refunds" onNavigate={handleTabSelect} />;
      case 'customer_track':
        return <TrackReturn initialReturnId={trackTargetReturnId} />;
      case 'customer_policy':
        return <ReturnPolicyView />;
      case 'customer_support':
        return (
          <div className="surface-card" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>Customer Support Desk & Assistance</h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
              Have questions about your return, exchange, or refund status? Our team is available 24/7.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <div style={{ background: '#1e293b', padding: '16px 24px', borderRadius: '8px', flex: 1 }}>
                <h4 style={{ color: '#38bdf8', marginBottom: '4px' }}>24/7 Live Chat</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Click the floating blue button at the bottom right to start a chat instantly.</p>
              </div>
              <div style={{ background: '#1e293b', padding: '16px 24px', borderRadius: '8px', flex: 1 }}>
                <h4 style={{ color: '#34d399', marginBottom: '4px' }}>SLA Commitment</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Returns reviewed within 24 business hours. Bank refunds processed in 5-7 days.</p>
              </div>
            </div>
          </div>
        );

      // Support Routes
      case 'support_dashboard':
      case 'support_lookup':
      case 'support_returns':
        return <SupportDashboard activeSubTab={activeTab} onNavigateOverride={() => setActiveTab('support_override')} />;
      case 'support_comms':
        return (
          <div className="surface-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '14px' }}>Customer Support Communication Center</h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '16px' }}>
              Real-time SMS milestone dispatch system powered by Twilio SMS API.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: '6px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#38bdf8' }}>SMS Dispatch Template: RETURN_INITIATED</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '4px' }}>"Your return request [ID] has been submitted. Pickup scheduled."</div>
              </div>
              <div style={{ padding: '10px 14px', background: '#1e293b', borderRadius: '6px', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 600, color: '#34d399' }}>SMS Dispatch Template: REFUND_CREDITED</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '4px' }}>"Refund of $[Amount] credited via Razorpay Gateway. Ref: [Razorpay_ID]"</div>
              </div>
            </div>
          </div>
        );
      case 'support_override':
        return <OverrideCenter />;
      case 'support_manual_refund':
        return <OverrideCenter initialStatus="REFUNDED" />;

      // Warehouse QC Routes
      case 'qc_dashboard':
        return <ReceivablesConsole onNavigateAppraisal={handleNavigateToAppraisal} />;
      case 'qc_pending':
        return <ReceivablesConsole filterStatus="PENDING" onNavigateAppraisal={handleNavigateToAppraisal} />;
      case 'qc_history':
        return <ReceivablesConsole filterStatus="COMPLETED" onNavigateAppraisal={handleNavigateToAppraisal} />;
      case 'qc_appraisal':
      case 'qc_images':
      case 'qc_disposition':
        return (
          <QCAppraisalForm
            initialReturnId={qcInspectTargetReturnId}
            onSubmitted={() => setActiveTab('qc_dashboard')}
          />
        );

      // Finance Routes
      case 'finance_dashboard':
        return <DisbursementDesk focusView="dashboard" />;
      case 'finance_refund_queue':
        return <DisbursementDesk focusView="queue" filterStatus="PENDING" />;
      case 'finance_cod':
        return <DisbursementDesk focusView="cod" filterMethod="BANK_TRANSFER" />;
      case 'finance_transfers':
        return <DisbursementDesk focusView="transfers" filterMethod="NEFT" />;
      case 'finance_liability':
        return <DisbursementDesk focusView="liability" />;
      case 'finance_reports':
        return <DisbursementDesk focusView="reports" />;

      // Supplier Manager Routes
      case 'supplier_dashboard':
      case 'supplier_rtm':
      case 'supplier_credit_notes':
      case 'supplier_returns':
      case 'supplier_analytics':
        return <RTMManagement focusView={activeTab} />;

      // System Admin Routes
      case 'admin_dashboard':
      case 'admin_users':
      case 'admin_logistics':
        return <AdminDashboard activeSubTab={activeTab} />;
      case 'admin_policies':
      case 'admin_refund_rules':
      case 'admin_settings':
        return <PolicyEngine activeSubTab={activeTab} />;
      case 'admin_fraud':
        return <FraudQueue />;
      case 'admin_analytics':
      case 'admin_reports':
        return <AdminReports />;

      // Common Profile & Settings
      case 'common_profile':
        return (
          <div className="surface-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
                {currentUser?.avatar || 'U'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{currentUser?.name}</h3>
                <span className="badge badge-blue">{currentUser?.role?.replace('_', ' ')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div><strong>Email:</strong> {currentUser?.email}</div>
              <div><strong>Account ID:</strong> {currentUser?.customerId || currentUser?.inspectorId || currentUser?.id}</div>
              <div><strong>Auth Standard:</strong> JWT RFC 7519 • HMAC-SHA512 Verified</div>
              {currentUser?.address && <div><strong>Default Pickup Address:</strong> {currentUser.address}</div>}
            </div>
          </div>
        );

      case 'common_settings':
        return (
          <div className="surface-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#38bdf8" />
              <span>Platform & Security Configuration</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
                <span>Razorpay Webhook Listener</span>
                <span className="badge badge-green">ACTIVE (200 OK)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
                <span>Delhivery / Shiprocket Reverse Logistics API</span>
                <span className="badge badge-green">CONNECTED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
                <span>Twilio SMS Gateway</span>
                <span className="badge badge-green">DISPATCHING</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
                <span>Bank IFSC Encryption at Rest</span>
                <span className="badge badge-blue">AES-256 GCM</span>
              </div>
            </div>
          </div>
        );

      default:
        return <CustomerHome onNavigate={handleTabSelect} />;
    }
  };

  return (
    <div className="platform-layout">
      {/* Dynamic Role Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={handleTabSelect} />

      {/* Main Viewport */}
      <main className="platform-main-viewport">
        <div className="platform-content-inner">
          {renderContent()}
        </div>

        {/* SRS Appendix I.5 Compliant Footer */}
        <Footer />
      </main>

      {/* Floating Support Chat Widget */}
      <SupportChatWidget />

      {/* Barcode Scanner Trigger Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectBarcode={(code) => handleNavigateToAppraisal(code)}
      />
    </div>
  );
};
