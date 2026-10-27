# RETRIEVE — Return & Refund Processing Management System (SRS-29)

Enterprise-grade frontend for the **Return & Refund Processing Management System**, developed with **React 18+**, **JSX format**, and **separate dedicated CSS files for every component and page**.

---

## 🚀 Quick Start

The server is currently running at:
👉 **[http://localhost:8081](http://localhost:8081)**

To start the server anytime:
- Simply double-click **`start.bat`** in this folder, or
- Run:
  ```powershell
  $env:PATH = "D:\Program Files\nodejs;" + $env:PATH
  npm run dev
  ```

---

## 🔑 Operational Role Passports & Credentials

Switch between any of the 6 roles instantly via the **top-right "Role Passport" dropdown** or sign in with:

| Role | Name | Email | Password |
|---|---|---|---|
| **Customer** | Karthik | `karthik@example.com` | `admin123` |
| **Customer Support Agent** | Support Agent | `support@enterprise.com` | `admin123` |
| **Warehouse QC Staff** | Alex Warehouse Tech | `qc@warehouse.com` | `admin123` |
| **Finance Manager** | Sarah Accountant | `finance@rrms.com` | `admin123` |
| **Supplier Manager** | Frank Supplier Rel | `supplier@elco.com` | `admin123` |
| **System Administrator** | System Admin | `admin@rrms.com` | `admin123` |

---

## 🖥️ Views Implemented (Exact 16 Template Screenshots)

1. **Login & Role Passport Selection** (`src/pages/auth/Login.jsx` + `Login.css`)
2. **Customer Portal: Home Dashboard** (`src/pages/customer/CustomerHome.jsx` + `CustomerHome.css`)
3. **Customer Portal: Initiate Return Form - Order Selection** (`src/pages/customer/InitiateReturn.jsx` + `InitiateReturn.css`)
4. **Customer Portal: Upload Proof - Reason & Media** (`src/pages/customer/InitiateReturn.jsx` + `InitiateReturn.css`)
5. **Customer Portal: Return History & Database** (`src/pages/customer/ReturnHistory.jsx` + `ReturnHistory.css`)
6. **Customer Portal: Track Return Timeline** (`src/pages/customer/TrackReturn.jsx` + `TrackReturn.css`)
7. **Customer Support: Agent Dashboard** (`src/pages/support/SupportDashboard.jsx` + `SupportDashboard.css`)
8. **Customer Support: Override & Manual Refund Desk** (`src/pages/support/OverrideCenter.jsx` + `OverrideCenter.css`)
9. **Warehouse QC: Receivables Console** (`src/pages/qc/ReceivablesConsole.jsx` + `ReceivablesConsole.css`)
10. **Warehouse QC: Simulated Barcode Scanner** (`src/components/modals/BarcodeScannerModal.jsx` + `BarcodeScannerModal.css`)
11. **Warehouse QC: Quality Control Appraisal Form** (`src/pages/qc/QCAppraisalForm.jsx` + `QCAppraisalForm.css`)
12. **Finance: Refund Queue & Disbursement Desk** (`src/pages/finance/DisbursementDesk.jsx` + `DisbursementDesk.css`)
13. **Supplier Manager: RTM & Credit Notes** (`src/pages/supplier/RTMManagement.jsx` + `RTMManagement.css`)
14. **System Admin: Dashboard** (`src/pages/admin/AdminDashboard.jsx` + `AdminDashboard.css`)
15. **System Admin: Fraud Queue & Risk Quarantine** (`src/pages/admin/FraudQueue.jsx` + `FraudQueue.css`)
16. **System Admin: Reports** (`src/pages/admin/AdminReports.jsx` + `AdminReports.css`)

---

## 📦 Project Structure

```
e:\RRPS\
├── start.bat                         # Quick launcher
├── index.html                        # App entry point
├── package.json                      # Dependencies (React 18, Vite, Lucide)
├── vite.config.js                    # Vite configuration (port 8081)
└── src\
    ├── main.jsx                      # App root
    ├── App.jsx / App.css             # Root state & logistics polling hook
    ├── index.css                     # Dark neon theme tokens & resets
    ├── context\
    │   ├── AuthContext.jsx           # JWT & role passport management
    │   └── AppContext.jsx            # Reactive state (returns, QC, refunds, fraud, RTM, policies)
    ├── data\
    │   └── initialData.js            # Seed database (RET-9001 to RET-9006, orders, pickups, QC, refunds)
    ├── components\
    │   ├── common\
    │   │   ├── NavBar.jsx + NavBar.css
    │   │   ├── Sidebar.jsx + Sidebar.css
    │   │   ├── Footer.jsx + Footer.css
    │   │   ├── Charts.jsx + Charts.css
    │   │   ├── NotificationDrawer.jsx + NotificationDrawer.css
    │   │   └── SupportChatWidget.jsx + SupportChatWidget.css
    │   └── modals\
    │       ├── BarcodeScannerModal.jsx + BarcodeScannerModal.css
    │       ├── ReturnDetailsModal.jsx + ReturnDetailsModal.css
    │       └── BankDetailsModal.jsx + BankDetailsModal.css
    └── pages\
        ├── Home.jsx                  # Appendix I.3 conformant export
        ├── ReturnPlatform.jsx        # Appendix I.4 role layout & routing
        ├── auth\Login.jsx
        ├── customer\CustomerHome.jsx, InitiateReturn.jsx, ReturnHistory.jsx, TrackReturn.jsx, MyOrders.jsx, ReturnPolicyView.jsx
        ├── support\SupportDashboard.jsx, OverrideCenter.jsx
        ├── qc\ReceivablesConsole.jsx, QCAppraisalForm.jsx
        ├── finance\DisbursementDesk.jsx
        ├── supplier\RTMManagement.jsx
        └── admin\AdminDashboard.jsx, FraudQueue.jsx, AdminReports.jsx, PolicyEngine.jsx
```
