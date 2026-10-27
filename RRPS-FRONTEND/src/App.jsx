import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { Login } from './pages/auth/Login';
import { NavBar } from './components/common/NavBar';
import { ReturnPlatform } from './pages/ReturnPlatform';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { CheckCircle, AlertTriangle, Radio } from 'lucide-react';
import './App.css';

export const App = () => {
  const { currentUser, token } = useAuth();
  const { toast } = useApp();

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [logisticsPollingStatus, setLogisticsPollingStatus] = useState('Syncing (200 OK)');

  // Appendix I.1: Logistics tracking polling hook
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      setLogisticsPollingStatus(`Polling Delhivery/Shiprocket [${new Date().toLocaleTimeString()}]`);
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // If unauthenticated, show Login & Role Passport Selection (Screenshot 1)
  if (!currentUser) {
    return (
      <div className="app-root">
        <Login />
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Appendix I.2: NavBar */}
      <NavBar
        onOpenNotifs={() => setIsNotifsOpen(true)}
      />

      {/* Appendix I.4: ReturnPlatform containing Sidebar, Views, and Footer */}
      <ReturnPlatform
        onOpenNotifs={() => setIsNotifsOpen(true)}
      />

      {/* Notification Drawer with SMS / Webhook Milestones */}
      <NotificationDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
      />

      {/* Global Interactive Toast */}
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          {toast.type === 'error' ? (
            <AlertTriangle size={18} color="#f43f5e" />
          ) : (
            <CheckCircle size={18} color="#10b981" />
          )}
          <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      {/* Logistics Polling Hook Status Pill (Appendix I.1) */}
      <div className="logistics-poll-pill">
        <div className="poll-pulse-dot" />
        <span>{logisticsPollingStatus}</span>
      </div>
    </div>
  );
};

export default App;
