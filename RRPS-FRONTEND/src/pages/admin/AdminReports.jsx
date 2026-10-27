import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  Truck,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Filter,
  BarChart2,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import './AdminReports.css';

export const AdminReports = () => {
  const { returnRequests, refunds, showToast } = useApp();

  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');

  const handleExportCSV = () => {
    const headers = ['Category,Return Rate,Refund TAT (Avg),QC Pass Rate,Avg Logistics Unit Cost'];
    const rows = [
      '"Consumer Electronics","18.4%","4.2 Days","72.5%","$14.80"',
      '"Apparel & Footwear","24.1%","1.8 Days","88.0%","$7.20"',
      '"Accessories & Peripherals","8.2%","2.5 Days","91.2%","$5.40"'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RRPS_Executive_Reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Executive Reports CSV.');
  };

  return (
    <div className="reports-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          System Admin: Platform Operational Reports
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Comprehensive reverse logistics performance, TAT SLA compliance, and unit cost breakdown.
        </p>
      </div>

      {/* 4 KPI cards matching Screenshot 16 */}
      <div className="overview-summary-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>
            <RotateCcw size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">{returnRequests.length}</span>
            <span className="metric-title">Total Returns</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Truck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">3</span>
            <span className="metric-title">Pending Logistics</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <Clock size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">1</span>
            <span className="metric-title">QC Pending Inspection</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-val">1</span>
            <span className="metric-title">Refunds Processed</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar-card">
        <div className="filter-inputs-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem' }}>
            <Filter size={15} />
            <span>Filters:</span>
          </div>

          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: '160px', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days (July 2026)</option>
            <option value="THIS_QUARTER">This Quarter (Q3 2026)</option>
            <option value="YTD">Year to Date (2026)</option>
          </select>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '160px', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="APPAREL">Apparel & Footwear</option>
            <option value="ACCESSORIES">Accessories</option>
          </select>

          <select
            className="form-select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{ width: '160px', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Logistics</option>
            <option value="DELHIVERY">Delhivery Fleet</option>
            <option value="SHIPROCKET">Shiprocket Express</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={handleExportCSV}>
            <FileSpreadsheet size={14} color="#10b981" />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => window.print()}>
            <FileText size={14} color="#f43f5e" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="report-breakdown-grid">
        <div className="surface-card">
          <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#38bdf8" />
            <span>Refund TAT vs SLA Performance (FR12)</span>
          </h4>
          <table className="app-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Target SLA</th>
                <th>Average TAT</th>
                <th>SLA Compliance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#fff' }}>Original Method (Razorpay)</td>
                <td>5–7 Days</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>3.8 Days</td>
                <td><span className="badge badge-green">98.4% On Time</span></td>
              </tr>
              <tr>
                <td style={{ color: '#fff' }}>Store Credit Wallet</td>
                <td>24 Hours</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>1.2 Hours</td>
                <td><span className="badge badge-green">100% On Time</span></td>
              </tr>
              <tr>
                <td style={{ color: '#fff' }}>Bank Transfer (COD NEFT)</td>
                <td>7 Days</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>4.6 Days</td>
                <td><span className="badge badge-green">96.8% On Time</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="surface-card">
          <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} color="#34d399" />
            <span>Reverse Logistics Unit Cost (FR12)</span>
          </h4>
          <table className="app-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th>Process Step</th>
                <th>Avg Cost / Unit</th>
                <th>% of Reverse Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#fff' }}>First-Mile Pickup (Delhivery/Shiprocket)</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$4.80</td>
                <td>42%</td>
              </tr>
              <tr>
                <td style={{ color: '#fff' }}>Hub Sorting & Line-Haul Transit</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$2.90</td>
                <td>25%</td>
              </tr>
              <tr>
                <td style={{ color: '#fff' }}>Warehouse QC Appraisal & Diagnostics</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$2.10</td>
                <td>18%</td>
              </tr>
              <tr>
                <td style={{ color: '#fff' }}>Restocking, Relabelling & Packaging</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$1.70</td>
                <td>15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
