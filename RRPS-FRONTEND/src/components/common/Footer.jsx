import React from 'react';
import { Shield, Clock, Award, FileCheck } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <Shield size={18} color="#38bdf8" />
            <span>RETRIEVE Platform (SRS-29)</span>
          </div>
          <p className="footer-brand-desc">
            Next-generation reverse logistics, QC dispositioning, and automated refund management for modern retail enterprises.
          </p>
          <div className="footer-badge">
            <Award size={13} />
            <span>Consumer Protection (E-Commerce) Rules 2020 Compliant</span>
          </div>
        </div>

        <div className="footer-column">
          <div className="footer-col-title">Refund Commitments</div>
          <span className="footer-link">SLA: 5–7 Business Days (Original Method)</span>
          <span className="footer-link">Store Credit Wallet: Instant +5% Bonus</span>
          <span className="footer-link">COD Refund: NEFT via IFSC Verification</span>
          <span className="footer-link">Razorpay Payouts Guaranteed</span>
        </div>

        <div className="footer-column">
          <div className="footer-col-title">Policies & Rights</div>
          <span className="footer-link">Electronics: 7-Day Window</span>
          <span className="footer-link">Apparel: 30-Day Free Return (Tag-On)</span>
          <span className="footer-link">One-Time Free Exchange Permitted</span>
          <span className="footer-link">Non-Returnable Items: Perishables</span>
        </div>

        <div className="footer-column">
          <div className="footer-col-title">Assistance & Legal</div>
          <span className="footer-link">Support: support@enterprise.com</span>
          <span className="footer-link">Toll-Free: 1800-RETRIEVE</span>
          <span className="footer-link">Privacy Policy & Encryption</span>
          <span className="footer-link">Data Retention: 7 Years Audit</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 RETRIEVE Systems Inc. All rights reserved. Enterprise Reverse Logistics Engine.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Version 1.0 (Draft 2026)</span>
          <span>•</span>
          <span>REST API: Port 8080</span>
          <span>•</span>
          <span>React.js: Port 8081</span>
        </div>
      </div>
    </footer>
  );
};
