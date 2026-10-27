import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { ReturnDetailsModal } from '../../components/modals/ReturnDetailsModal';
import './ReturnHistory.css';

export const ReturnHistory = ({ onNavigateTrack }) => {
  const { returnRequests, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const filteredReturns = returnRequests.filter((r) => {
    const matchesSearch =
      r.return_id.toLowerCase().includes(search.toLowerCase()) ||
      r.order_id.toLowerCase().includes(search.toLowerCase()) ||
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Return ID,Order ID,Customer,Product,Price,Status,Initiated At'];
    const rows = filteredReturns.map(r =>
      `"${r.return_id}","${r.order_id}","${r.customer_name}","${r.product_name}",${r.price},"${r.status}","${r.initiated_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RRPS_Returns_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported returns report to CSV successfully');
  };

  const handleExportPDF = () => {
    window.print();
    showToast('Generating PDF printout view...');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REFUNDED':
        return <span className="badge badge-green">REFUNDED</span>;
      case 'QC_DONE':
        return <span className="badge badge-blue">QC COMPLETE</span>;
      case 'PICKUP_SCHEDULED':
        return <span className="badge badge-amber">PICKUP SCHEDULED</span>;
      case 'RECEIVED':
        return <span className="badge badge-blue">RECEIVED AT HUB</span>;
      case 'EXCHANGE_DISPATCHED':
        return <span className="badge badge-purple">EXCHANGE DISPATCHED</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="return-history-page">
      {/* Search & Filter Toolbar matching Screenshot 5 */}
      <div className="history-toolbar">
        <div className="history-search-box">
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '36px' }}
              placeholder="Search return ID, order, product, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={16}
              color="#64748b"
              style={{ position: 'absolute', left: '12px', top: '12px' }}
            />
          </div>
        </div>

        <div className="history-actions-box">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '170px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="INITIATED">Initiated</option>
            <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
            <option value="RECEIVED">Received</option>
            <option value="QC_DONE">QC Done</option>
            <option value="REFUNDED">Refunded</option>
            <option value="EXCHANGE_DISPATCHED">Exchange Dispatched</option>
          </select>

          <button className="btn-secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={15} color="#10b981" />
            <span>Export CSV</span>
          </button>

          <button className="btn-secondary" onClick={handleExportPDF}>
            <FileText size={15} color="#f43f5e" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Database Table matching Screenshot 5 */}
      <div className="data-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No return records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((row) => (
                  <tr key={row.return_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                      {row.return_id}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      {row.order_id}
                    </td>
                    <td style={{ fontWeight: 500, color: '#f8fafc' }}>
                      {row.customer_name}
                    </td>
                    <td style={{ color: '#cbd5e1' }}>
                      {row.product_name}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ${row.price.toFixed(2)}
                    </td>
                    <td>
                      {getStatusBadge(row.status)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-primary"
                          style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                          onClick={() => setSelectedReturnId(row.return_id)}
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                          onClick={() => onNavigateTrack(row.return_id)}
                        >
                          <span>Track</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Showing 1-{filteredReturns.length} of {filteredReturns.length} entries
          </div>
          <div className="pagination-controls">
            <button className="page-btn active">1</button>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1 / 1</span>
          </div>
        </div>
      </div>

      {/* Return Dossier Details Modal */}
      <ReturnDetailsModal
        returnId={selectedReturnId}
        onClose={() => setSelectedReturnId(null)}
      />
    </div>
  );
};
