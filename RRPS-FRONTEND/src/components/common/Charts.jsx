import React from 'react';
import './Charts.css';

// 1. Monthly Return Trends Area Chart
export const MonthlyTrendsChart = () => {
  // Smooth curve points: (x, y)
  // High fidelity curve showing Jan to Jun trends
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">Monthly Return Trends</h4>
          <span className="chart-subtitle">Volume over last 6 months</span>
        </div>
      </div>
      <div className="svg-chart-container">
        <svg viewBox="0 0 400 160">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="30" x2="380" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="70" x2="380" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="140" x2="380" y2="140" stroke="#1e293b" />

          {/* Area Fill */}
          <path
            d="M 30 130 Q 80 115 130 90 T 230 65 T 310 100 T 370 45 L 370 140 L 30 140 Z"
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d="M 30 130 Q 80 115 130 90 T 230 65 T 310 100 T 370 45"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          <circle cx="30" cy="130" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <circle cx="130" cy="90" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <circle cx="230" cy="65" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <circle cx="310" cy="100" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <circle cx="370" cy="45" r="5" fill="#60a5fa" stroke="#ffffff" strokeWidth="2" />

          {/* Labels */}
          <text x="30" y="155" textAnchor="middle" fill="#64748b" fontSize="11">Feb</text>
          <text x="100" y="155" textAnchor="middle" fill="#64748b" fontSize="11">Mar</text>
          <text x="170" y="155" textAnchor="middle" fill="#64748b" fontSize="11">Apr</text>
          <text x="240" y="155" textAnchor="middle" fill="#64748b" fontSize="11">May</text>
          <text x="310" y="155" textAnchor="middle" fill="#64748b" fontSize="11">Jun</text>
          <text x="370" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">Jul</text>
        </svg>
      </div>
    </div>
  );
};

// 2. Category-wise Returns Bar Chart
export const CategoryReturnsChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">Category-wise Returns</h4>
          <span className="chart-subtitle">Distribution by department</span>
        </div>
      </div>
      <div className="svg-chart-container">
        <svg viewBox="0 0 300 160">
          <defs>
            <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          <line x1="20" y1="40" x2="280" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="90" x2="280" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="20" y1="135" x2="280" y2="135" stroke="#1e293b" />

          {/* Bar 1: Electronics */}
          <rect x="40" y="30" width="36" height="105" rx="5" fill="url(#barGrad1)" />
          <text x="58" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">48%</text>
          <text x="58" y="152" textAnchor="middle" fill="#64748b" fontSize="10">Elec</text>

          {/* Bar 2: Apparel */}
          <rect x="105" y="55" width="36" height="80" rx="5" fill="url(#barGrad2)" />
          <text x="123" y="49" textAnchor="middle" fill="#818cf8" fontSize="11" fontWeight="600">28%</text>
          <text x="123" y="152" textAnchor="middle" fill="#64748b" fontSize="10">Appar</text>

          {/* Bar 3: Acc */}
          <rect x="170" y="85" width="36" height="50" rx="5" fill="url(#barGrad3)" />
          <text x="188" y="79" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">16%</text>
          <text x="188" y="152" textAnchor="middle" fill="#64748b" fontSize="10">Access</text>

          {/* Bar 4: Home */}
          <rect x="235" y="110" width="36" height="25" rx="5" fill="url(#barGrad4)" />
          <text x="253" y="104" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">8%</text>
          <text x="253" y="152" textAnchor="middle" fill="#64748b" fontSize="10">Home</text>
        </svg>
      </div>
    </div>
  );
};

// 3. Refund Status Distribution Donut Chart
export const RefundDistributionChart = () => {
  // 65% Original Method (#10b981), 25% Store Credit (#2563eb), 10% Pending (#f59e0b)
  // Circumference = 2 * PI * 44 ≈ 276.46
  // Segment 1 (65%): 179.7, dashoffset: 0
  // Segment 2 (25%): 69.1, dashoffset: -179.7
  // Segment 3 (10%): 27.6, dashoffset: -248.8
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">Refund Status Distribution</h4>
          <span className="chart-subtitle">Payment channel breakdown</span>
        </div>
      </div>
      <div className="donut-wrapper">
        <div className="donut-svg-box">
          <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="44" stroke="#162238" strokeWidth="14" fill="none" />
            
            {/* Segment 1: Original Method 65% */}
            <circle
              cx="60"
              cy="60"
              r="44"
              stroke="#10b981"
              strokeWidth="14"
              fill="none"
              strokeDasharray="179.7 276.46"
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Segment 2: Store Credit 25% */}
            <circle
              cx="60"
              cy="60"
              r="44"
              stroke="#3b82f6"
              strokeWidth="14"
              fill="none"
              strokeDasharray="69.1 276.46"
              strokeDashoffset="-184"
              strokeLinecap="round"
            />
            {/* Segment 3: Pending/Other 10% */}
            <circle
              cx="60"
              cy="60"
              r="44"
              stroke="#f59e0b"
              strokeWidth="14"
              fill="none"
              strokeDasharray="27.6 276.46"
              strokeDashoffset="-257"
              strokeLinecap="round"
            />
          </svg>
          <div className="donut-center-text">
            <div className="donut-center-title">Refunds</div>
            <div className="donut-center-value">100%</div>
          </div>
        </div>

        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ background: '#10b981' }}></span>
              <span>Original Method</span>
            </div>
            <span className="legend-percent">(65%)</span>
          </div>

          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
              <span>Store Credit</span>
            </div>
            <span className="legend-percent">(25%)</span>
          </div>

          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
              <span>Pending / Other</span>
            </div>
            <span className="legend-percent">(10%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
