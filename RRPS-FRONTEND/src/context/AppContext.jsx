import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderApi, returnApi, qcApi, refundApi, pickupApi, fraudApi, rtmApi, policyApi } from '../api/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [qcInspections, setQcInspections] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [fraudFlags, setFraudFlags] = useState([]);
  const [rtmBatches, setRtmBatches] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchBackendData = useCallback(async () => {
    try {
      const backendOrders = await orderApi.getAll();
      if (Array.isArray(backendOrders)) {
        const mappedOrders = backendOrders.map(o => ({
          orderId: o.orderNumber || o.order_number,
          orderDate: o.orderDate ? o.orderDate.slice(0,10) : '2026-07-28',
          deliveryDate: o.deliveredAt ? o.deliveredAt.slice(0,10) : '2026-07-31',
          items: (o.items && o.items.length > 0) ? o.items.map(i => ({
            orderLineId: `OL-${i.orderItemId || Math.floor(Math.random() * 1000)}`,
            name: i.sku ? i.sku.productName : 'Enterprise Wireless Keyboard',
            price: typeof i.unitPrice === 'number' ? i.unitPrice : (i.price || (i.sku ? i.sku.price : 120)),
            quantity: i.quantity || 1,
            skuId: i.sku ? (i.sku.skuCode || i.sku.skuId) : 'SKU-KEYB-BLK',
            category: i.sku ? i.sku.category : 'Electronics',
            image: i.sku && i.sku.imageUrl ? i.sku.imageUrl : 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80'
          })) : [{
            orderLineId: `OL-${o.orderId || Math.floor(Math.random() * 1000)}`,
            name: 'Enterprise Wireless Keyboard',
            price: typeof o.totalAmount === 'number' ? o.totalAmount : 120,
            quantity: 1,
            skuId: 'SKU-KEYB-BLK',
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80'
          }]
        }));
        setOrders(mappedOrders);
      }
    } catch (e) { console.warn('fetchBackendData orders error:', e.message); }

    try {
      const backendReturns = await returnApi.getAll();
      if (Array.isArray(backendReturns)) {
        const mappedReturns = backendReturns.map(r => ({
          return_id: r.returnId || r.return_id,
          order_id: r.order ? r.order.orderNumber : (r.order_id || 'ORD-98721'),
          customer_id: r.customer ? r.customer.customerId : (r.customer_id || 'CUST-4410'),
          customer_name: r.customer ? r.customer.name : (r.customer_name || 'Karthik'),
          product_name: r.items && r.items[0] && r.items[0].sku ? r.items[0].sku.productName : (r.product_name || 'Enterprise Wireless Keyboard'),
          price: r.items && r.items[0] && r.items[0].sku ? r.items[0].sku.price : (r.price || 120),
          policy_id: r.policy ? r.policy.policyId : (r.policy_id || 'POL-ELEC-07'),
          return_type: r.returnType || r.return_type || 'RETURN',
          reason_code: r.reasonCode || r.reason_code || 'damaged_in_transit',
          status: r.status || r.return_status || 'INITIATED',
          preferred_refund_method: r.preferredRefundMethod || r.preferred_refund_method || 'ORIGINAL',
          initiated_at: r.initiatedAt ? r.initiatedAt.replace('T', ' ').slice(0, 16) : (r.initiated_at || '2026-07-12 10:15'),
          support_override: r.supportOverride || false
        }));
        setReturnRequests(mappedReturns);
      }
    } catch (e) { console.warn('fetchBackendData returnRequests error:', e.message); }

    try {
      const backendPickups = await pickupApi.getAll();
      if (Array.isArray(backendPickups)) {
        const mappedPickups = backendPickups.map(p => ({
          pickup_id: p.pickupId || p.pickup_id,
          return_id: p.returnRequest ? p.returnRequest.returnId : p.return_id,
          logistics_partner: p.logisticsPartner || p.logistics_partner,
          awb_number: p.awbNumber || p.awb_number,
          pickup_date: p.pickupDate || p.pickup_date,
          pickup_slot: p.pickupSlot || p.pickup_slot,
          status: p.status,
          pickup_otp: p.pickupOtp || p.pickup_otp,
          reschedule_count: p.rescheduleCount || 0
        }));
        setPickups(mappedPickups);
      }
    } catch (e) { console.warn('fetchBackendData pickups error:', e.message); }

    try {
      const backendQc = await qcApi.getInspections();
      if (Array.isArray(backendQc)) {
        const mappedQc = backendQc.map(q => ({
          qc_id: q.qcId || q.qc_id,
          return_id: q.returnRequest ? q.returnRequest.returnId : q.return_id,
          inspector_id: q.inspector ? q.inspector.name : q.inspector_id,
          condition_grade: q.conditionGrade || q.condition_grade,
          functional_test: q.functionalTest || q.functional_test,
          complaint_validated: q.complaintValidated !== undefined ? q.complaintValidated : true,
          disposition: q.disposition,
          notes: q.notes || '',
          inspected_at: q.inspectedAt ? q.inspectedAt.replace('T', ' ').slice(0, 16) : null,
          images: q.images ? [q.images] : []
        }));
        setQcInspections(mappedQc);
      }
    } catch (e) { console.warn('fetchBackendData qc error:', e.message); }

    try {
      const backendRefunds = await refundApi.getAll();
      if (Array.isArray(backendRefunds)) {
        const mappedRefunds = backendRefunds.map(rf => ({
          refund_id: rf.refundId || rf.refund_id,
          return_id: rf.returnRequest ? rf.returnRequest.returnId : rf.return_id,
          customer_name: rf.returnRequest && rf.returnRequest.customer ? rf.returnRequest.customer.name : 'Karthik',
          amount: rf.amount,
          method: rf.method === 'ORIGINAL' ? 'ORIGINAL_METHOD' : rf.method,
          razorpay_refund_id: rf.razorpayRefundId || rf.razorpay_refund_id,
          status: rf.status,
          initiated_at: rf.initiatedAt ? rf.initiatedAt.replace('T', ' ').slice(0, 16) : null,
          credited_at: rf.creditedAt ? rf.creditedAt.replace('T', ' ').slice(0, 16) : null
        }));
        setRefunds(mappedRefunds);
      }
    } catch (e) { console.warn('fetchBackendData refunds error:', e.message); }

    try {
      const backendFraud = await fraudApi.getQueue();
      if (Array.isArray(backendFraud)) {
        const mappedFraud = backendFraud.map(f => ({
          flag_id: f.flagId || f.flag_id,
          return_id: f.returnRequest ? f.returnRequest.returnId : f.return_id,
          customer_name: f.customer ? f.customer.name : 'Customer',
          flag_type: f.flagType || f.flag_type || 'SUSPICIOUS_ACTIVITY',
          severity: f.severity || 'MEDIUM',
          status: f.status,
          flagged_at: f.flaggedAt ? f.flaggedAt.replace('T', ' ').slice(0, 16) : null
        }));
        setFraudFlags(mappedFraud);
      }
    } catch (e) { console.warn('fetchBackendData fraud error:', e.message); }

    try {
      const backendRtm = await rtmApi.getAll();
      if (Array.isArray(backendRtm)) {
        const mappedRtm = backendRtm.map(b => ({
          rtm_id: b.rtmId || b.rtm_id,
          supplier_id: b.supplier ? b.supplier.supplierId : 'SUP-ELCO-19',
          supplier_name: b.supplier ? b.supplier.name : 'Elco Micro Components Ltd.',
          awb_number: b.awbNumber || b.awb_number,
          credit_note_value: b.creditNoteValue || b.credit_note_value || 0,
          status: b.status,
          items_count: 5,
          dispatched_at: null
        }));
        setRtmBatches(mappedRtm);
      }
    } catch (e) { console.warn('fetchBackendData rtm error:', e.message); }

    try {
      const backendPolicies = await policyApi.getAll();
      if (Array.isArray(backendPolicies)) {
        const mappedPolicies = backendPolicies.map(p => ({
          policy_id: p.policyId || p.policy_id,
          entity_type: p.entityType || p.entity_type,
          category_name: p.entityType === 'CATEGORY' ? 'Consumer Electronics' : 'General Merchandise',
          return_window_days: p.returnWindowDays || p.return_window_days || 7,
          free_return: p.freeReturn || p.free_return || false,
          exchange_eligible: p.exchangeEligible || p.exchange_eligible || true,
          effective_from: p.effectiveFrom
        }));
        setPolicies(mappedPolicies);
      }
    } catch (e) { console.warn('fetchBackendData policies error:', e.message); }
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => { setToast(null); }, 4500);
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const initiateReturn = async (data) => {
    try {
      const mappedData = {
        order_id: data.orderId,
        customer_id: data.customerId,
        customer_name: data.customerName,
        product_name: data.productName,
        price: data.price,
        return_type: data.returnType,
        reason_code: data.reasonCode,
        preferred_refund_method: data.preferredRefundMethod,
        logistics_partner: data.logisticsPartner,
        pickup_date: data.pickupDate,
        pickup_slot: data.pickupSlot
      };
      
      const res = await returnApi.create(mappedData);
      await fetchBackendData();
      addNotification('Return Request Created', `Return created successfully.`, 'success');
      showToast(`Return initiated!`);
      return res.returnId || res.return_id;
    } catch (err) {
      console.warn('Backend create return fallback:', err.message);
      showToast('Error initiating return: ' + err.message, 'error');
    }
  };

  const reschedulePickup = async (pickupId, newDate, newSlot) => {
    try {
      await pickupApi.reschedule(pickupId, { pickupDate: newDate, pickupSlot: newSlot });
      await fetchBackendData();
      showToast(`Pickup rescheduled to ${newDate} (${newSlot}).`);
      addNotification('Pickup Rescheduled', `Pickup has been moved to ${newDate} ${newSlot}.`, 'info');
    } catch (err) {
      console.warn('Pickup API reschedule fallback:', err.message);
      showToast('Error rescheduling pickup: ' + err.message, 'error');
    }
  };

  const executeSupportOverride = async (returnId, newStatus, reason, additionalDays = 0) => {
    try {
      await returnApi.supportOverride(returnId, { newStatus, reason, additionalDays });
      await fetchBackendData();
      addNotification('Support Override Executed', `Manual override applied to ${returnId}: Status updated to ${newStatus}.`, 'warning');
      showToast(`Override successfully applied to ${returnId}!`);
    } catch (err) {
      console.warn('Support override API fallback:', err.message);
      showToast('Error applying override: ' + err.message, 'error');
    }
  };

  const submitQCInspection = async (data) => {
    try {
      await qcApi.submitInspection(data);
      await fetchBackendData();
      addNotification('QC Appraisal Completed', `QC Inspection completed.`, 'info');
      showToast(`QC completed`);
    } catch (err) {
      console.warn('QC API fallback:', err.message);
      showToast('Error submitting QC: ' + err.message, 'error');
    }
  };

  const disburseRefund = async (refundId) => {
    try {
      await refundApi.disburse(refundId);
      await fetchBackendData();
      addNotification('Refund Disbursed', `Refund ${refundId} has been credited.`, 'success');
      showToast(`Refund ${refundId} disbursed successfully!`);
    } catch (err) {
      console.warn('Refund disburse API fallback:', err.message);
      showToast('Error disbursing refund: ' + err.message, 'error');
    }
  };

  const resolveFraudFlag = async (flagId, newStatus, actionNote = '') => {
    try {
      await fraudApi.updateFlag(flagId, { status: newStatus, notes: actionNote });
      await fetchBackendData();
      addNotification('Fraud Queue Updated', `Fraud Flag ${flagId} updated to ${newStatus}.`, newStatus === 'CONFIRMED' ? 'error' : 'info');
      showToast(`Fraud Flag ${flagId} status changed to ${newStatus}`);
    } catch (err) {
      console.warn('Fraud flag API fallback:', err.message);
      showToast('Error resolving fraud flag: ' + err.message, 'error');
    }
  };

  const createRTMBatch = async (data) => {
    try {
      await rtmApi.createBatch(data);
      await fetchBackendData();
      showToast(`New Supplier RTM Batch created!`);
      addNotification('RTM Batch Created', `Supplier batch created.`, 'info');
    } catch (err) {
      console.warn('RTM create batch API fallback:', err.message);
      showToast('Error creating RTM batch: ' + err.message, 'error');
    }
  };

  const dispatchRTMBatch = async (rtmId) => {
    try {
      await rtmApi.dispatchBatch(rtmId);
      await fetchBackendData();
      showToast(`Batch ${rtmId} dispatched via logistics`);
      addNotification('RTM Batch Dispatched', `RTM Batch ${rtmId} dispatched to manufacturer.`, 'success');
    } catch (err) {
      console.warn('RTM dispatch API fallback:', err.message);
      showToast('Error dispatching RTM batch: ' + err.message, 'error');
    }
  };

  const updatePolicy = async (policyId, updatedFields) => {
    try {
      await policyApi.update(policyId, updatedFields);
      await fetchBackendData();
      showToast(`Return Policy ${policyId} updated successfully.`);
    } catch (err) {
      console.warn('Policy update API fallback:', err.message);
      showToast('Error updating policy: ' + err.message, 'error');
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared.');
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        returnRequests,
        returnItems,
        pickups,
        qcInspections,
        refunds,
        fraudFlags,
        rtmBatches,
        policies,
        notifications,
        toast,
        showToast,
        addNotification,
        fetchBackendData,
        initiateReturn,
        reschedulePickup,
        executeSupportOverride,
        submitQCInspection,
        disburseRefund,
        resolveFraudFlag,
        createRTMBatch,
        dispatchRTMBatch,
        updatePolicy,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
