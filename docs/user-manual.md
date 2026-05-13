# MLR-AZ PMS — User Manual

**Product Management System**
New Era University – College of Computer Studies
Academic Year 2025–2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Registration](#registration)
3. [Login](#login)
4. [Product Management](#product-management)
5. [Reports](#reports)
6. [Admin — User Management](#admin--user-management)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Troubleshooting](#troubleshooting)

---

## 1. Getting Started

MLR-AZ PMS (Product Management System) is a web-based system for managing product inventory, price history, and sales reports. It supports three user roles: **USER**, **ADMIN**, and **SUPERADMIN**.

**Access the system at:** `https://your-app.vercel.app`

Supported browsers: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+.

---

## 2. Registration

### Email Registration

1. Navigate to the login page and click **"Register here"**.
2. Fill in the required fields:
   - **First Name** and **Last Name**
   - **Username** (unique identifier)
   - **Email address**
   - **Password** (minimum 6 characters)
3. Click **"Register"**.
4. Check your email inbox for a confirmation link from Supabase.
5. Click the confirmation link. Your account will be created with **USER** role and **ACTIVE** status.
6. An administrator can later change your role to ADMIN if needed.

### Google Registration

1. On the login or register page, click **"Continue with Google"**.
2. Select your Google account in the popup.
3. You will be redirected back to the system and logged in automatically.
4. Your account is provisioned as **USER / ACTIVE** automatically.

---

## 3. Login

### Email Login

1. Enter your registered **email** and **password**.
2. Click **"Sign In"**.
3. If your account is **INACTIVE**, you will see: *"Your account is pending activation. Contact an administrator."*
4. On successful login, you are redirected to the **Products** page.

### Google Login

1. Click **"Continue with Google"**.
2. Select your Google account.
3. You are automatically logged in and redirected to the Products page.

### Logout

Click your **username** in the top-right corner, then select **"Sign Out"**.

---

## 4. Product Management

> **Access:** Available to all logged-in users. Add / Edit / Delete actions require ADMIN or SUPERADMIN role.

### Viewing Products

- Navigate to **Products** in the left sidebar.
- The table displays: **Code**, **Description**, **Unit**, **Price**.
- Use the **search bar** to filter by code or description.

### Adding a Product *(ADMIN / SUPERADMIN only)*

1. Click the **"+ Add Product"** button in the toolbar.
2. Fill in:
   - **Product Code** (e.g., `NB0006`) — automatically uppercased
   - **Description**
   - **Unit** (`ea`, `pc`, `mtr`, `pkg`, `ltr`)
   - **Current Price**
3. Click **"Save Product"**.

### Editing a Product *(ADMIN / SUPERADMIN only)*

1. Click the **⋮ (three-dot)** menu on any product row.
2. Select **"Edit Details"**.
3. Modify the fields and click **"Save Product"**.

### Price History

1. Click the **⋮** menu on a product row.
2. Select **"Price History"** to view historical pricing.

### Soft Deleting a Product *(SUPERADMIN only)*

1. Click the **⋮** menu on a product row.
2. Select **"Delete"**.
3. Confirm the prompt: *"Move [CODE] to deleted items?"*
4. The product moves to **Deleted Items** and is hidden from the main list.

### Recovering a Deleted Product *(ADMIN / SUPERADMIN)*

1. Navigate to **Deleted Items** in the sidebar.
2. Find the product and click **"Recover"**.
3. The product returns to the active list.

---

## 5. Reports

> **Access:** ADMIN and SUPERADMIN only. Links are hidden from USER accounts.

### REP_001 — Product Report

Navigate to **Reports → Product Report** in the sidebar.

- Displays all **active products** with current price.
- **Filter** by name/code or by unit type.
- **Sort** any column by clicking the column header.
- Click **"Export CSV"** to download the report as a spreadsheet.

### REP_002 — Top Selling Products

Navigate to **Reports → Top Selling** in the sidebar.

- Displays a **horizontal bar chart** of the top 10 products by total units sold.
- Data sourced from the sales detail table.

---

## 6. Admin — User Management

> **Access:** ADMIN and SUPERADMIN only. Accessible via **Admin** in the sidebar.

The Admin page shows all registered users with:
- **User ID** (truncated)
- **Username**
- **Email**
- **Role** (SUPERADMIN / ADMIN / USER)
- **Status** (ACTIVE / INACTIVE)
- **Action buttons**

### Activating a User

Click the **"Active"** button on a USER or ADMIN row to set their status to ACTIVE.

### Deactivating a User

Click the **"Inactive"** button on a USER or ADMIN row to set their status to INACTIVE. The user will be blocked on their next login attempt.

### SUPERADMIN Protection

> ⚠️ **SUPERADMIN rows cannot be modified.** All action buttons on SUPERADMIN rows are disabled and display **"Protected"**. This is enforced at both the UI level and the database level (RLS policy).

---

## 7. User Roles & Permissions

| Feature | USER | ADMIN | SUPERADMIN |
|---|---|---|---|
| View Products | ✅ | ✅ | ✅ |
| Add Product | ❌ | ✅ | ✅ |
| Edit Product | ❌ | ✅ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |
| View Deleted Items | ❌ | ✅ | ✅ |
| Recover Product | ❌ | ✅ | ✅ |
| Product Report (REP_001) | ❌ | ✅ | ✅ |
| Top Selling (REP_002) | ❌ | ✅ | ✅ |
| Admin / User Mgmt | ❌ | ✅ | ✅ |
| Modify SUPERADMIN rows | ❌ | ❌ | ❌ |

---

## 8. Troubleshooting

| Issue | Solution |
|---|---|
| Blank screen on load | Check browser console; clear cache and reload |
| "Configuration error" message | Contact admin — Supabase env vars may be missing |
| Google login not working | Check that production redirect URL is set in Supabase |
| Account shows INACTIVE | Ask an ADMIN to activate your account via the Admin page |
| Products not loading | Check network tab; Supabase RLS may need to be verified |

---

*Hope PMS — User Manual v1.0 | Sprint 3 Final Deliverable*
*New Era University – BS Information Technology*
