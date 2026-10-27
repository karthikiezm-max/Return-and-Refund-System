import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Truck,
  Trash2
} from 'lucide-react';
import './NotificationDrawer.css';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="notif-icon-box notif-icon-success"><CheckCircle2 size={16} /></div>;
      case 'warning':
        return <div className="notif-icon-box notif-icon-warning"><AlertTriangle size={16} /></div>;
      case 'error':
        return <div className="notif-icon-box notif-icon-error"><AlertTriangle size={16} /></div>;
      default:
        return <div className="notif-icon-box notif-icon-info"><Info size={16} /></div>;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-box">
            <Bell size={18} color="#38bdf8" />
            <h3 className="drawer-title">Return Milestones & Alerts</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-card ${!n.read ? 'unread' : ''}`}
                onClick={() => markNotificationRead(n.id)}
              >
                {getIcon(n.type)}
                <div className="notif-body">
                  <div className="notif-title-row">
                    <span className="notif-heading">{n.title}</span>
                    <span className="notif-time">{n.time}</span>
                  </div>
                  <p className="notif-text">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-footer">
          <button
            className="btn-secondary"
            onClick={clearAllNotifications}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <Trash2 size={13} />
            <span>Clear All</span>
          </button>
          <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center' }}>
            Twilio SMS / Webhooks Gateway
          </span>
        </div>
      </div>
    </div>
  );
};
