import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight, RotateCcw, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import './MyOrders.css';

export const MyOrders = ({ onInitiateReturn }) => {
  const { orders, fetchBackendData } = useApp();

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  return (
    <div className="orders-page">
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          My Purchase Orders
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Select delivered items to request standard return or size exchange within the return window.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', marginTop: '20px' }}>
          <ShoppingBag size={44} color="#64748b" style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No Orders Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Connecting to PostgreSQL database to load purchase history...</p>
          <button className="btn-primary" onClick={() => fetchBackendData()} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
            <RefreshCw size={16} />
            <span>Sync Orders from Database</span>
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div className="order-card-header">
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Order ID: </span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{order.orderId}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Ordered: </span>
                  <span>{order.orderDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Delivered: </span>
                  <span style={{ color: '#34d399' }}>{order.deliveryDate}</span>
                </div>
              </div>
              <span className="badge badge-green">DELIVERED</span>
            </div>

            <div className="order-card-body">
              {order.items.map((item) => (
                <div key={item.orderLineId} className="order-item-row">
                  <div className="order-item-left">
                    <img src={item.image} alt={item.name} className="order-item-img" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{item.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        SKU: {item.skuId} • Category: {item.category} • Qty: {item.quantity}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '2px' }}>
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      onClick={() => onInitiateReturn(order.orderId)}
                    >
                      <RotateCcw size={14} />
                      <span>Return / Exchange</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
