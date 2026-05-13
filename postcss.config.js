# Hope PMS — Database Schema & ERD

**Sprint 1 · M3 – DB Engineer**

---

## Entity-Relationship Diagram

```
┌─────────────────────────────────┐
│           auth.users            │  (Supabase managed)
│─────────────────────────────────│
│ id            UUID  PK          │
│ email         TEXT              │
│ created_at    TIMESTAMPTZ       │
└─────────────┬───────────────────┘
              │ 1
              │ ON DELETE CASCADE
              │ 1
┌─────────────▼───────────────────┐
│            profiles             │
│─────────────────────────────────│
│ id            UUID  PK          │
│ auth_user_id  UUID  FK → auth.users.id  UNIQUE
│ username      TEXT  NOT NULL    │
│ email         TEXT  NOT NULL    │
│ user_type     TEXT  DEFAULT 'USER'       CHECK IN ('SUPERADMIN','ADMIN','USER')
│ status        TEXT  DEFAULT 'INACTIVE'   CHECK IN ('ACTIVE','INACTIVE')
│ created_at    TIMESTAMPTZ               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│            products             │
│─────────────────────────────────│
│ id            UUID  PK          │
│ code          TEXT  UNIQUE  NOT NULL     │
│ description   TEXT  NOT NULL    │
│ unit          TEXT  CHECK IN ('ea','pc','mtr','pkg','ltr')
│ price         NUMERIC(12,2)     │
│ active        BOOLEAN  DEFAULT true     │  ← record_status
│ deleted_by    TEXT  NULLABLE    │         ← stamp (who)
│ deleted_at    DATE  NULLABLE    │         ← stamp (when)
│ created_at    TIMESTAMPTZ       │
│ updated_at    TIMESTAMPTZ  (auto-updated by trigger)
└────────────────┬────────────────┘
                 │ code → sales_detail.product_code
                 │ 1 : many
┌────────────────▼────────────────┐
│          sales_detail           │
│─────────────────────────────────│
│ id            UUID  PK          │
│ product_code  TEXT  FK → products.code  │
│ quantity      INTEGER  CHECK > 0        │
│ created_at    TIMESTAMPTZ       │
└─────────────────────────────────┘
```

---

## Tables

### `profiles`
Extends Supabase `auth.users` with application-level role and status.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| auth_user_id | UUID | FK, UNIQUE | Links to `auth.users` |
| username | TEXT | NOT NULL | Display name |
| email | TEXT | NOT NULL | |
| user_type | TEXT | CHECK | `SUPERADMIN`, `ADMIN`, `USER` |
| status | TEXT | CHECK | `ACTIVE`, `INACTIVE` |
| created_at | TIMESTAMPTZ | NOT NULL | |

**RLS Policies:**
- `SELECT` — any authenticated user (needed for Admin module)
- `INSERT` — authenticated user inserting their own row only (`auth_user_id = auth.uid()`)
- `UPDATE` — authenticated user updating their own row only

---

### `products`
Core product catalog. `active` = `record_status`. `deleted_by` + `deleted_at` = stamp columns.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| code | TEXT | UNIQUE, NOT NULL | e.g. `AD0001` |
| description | TEXT | NOT NULL | |
| unit | TEXT | CHECK | `ea`, `pc`, `mtr`, `pkg`, `ltr` |
| price | NUMERIC(12,2) | CHECK ≥ 0 | |
| active | BOOLEAN | DEFAULT true | record_status |
| deleted_by | TEXT | NULLABLE | stamp — who soft-deleted |
| deleted_at | DATE | NULLABLE | stamp — when soft-deleted |
| created_at | TIMESTAMPTZ | NOT NULL | |
| updated_at | TIMESTAMPTZ | NOT NULL | Auto-updated by trigger |

**Trigger:** `products_updated_at` — fires `BEFORE UPDATE`, sets `updated_at = now()`.

**RLS Policies:**
- `SELECT` — any authenticated user
- `INSERT` — ADMIN or SUPERADMIN only (status ACTIVE)
- `UPDATE` — ADMIN or SUPERADMIN only (status ACTIVE)
- `DELETE` — SUPERADMIN only (hard delete, reserved for emergency use)

---

### `sales_detail`
Transaction records used for the Top Selling report.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| product_code | TEXT | FK → products.code | ON UPDATE CASCADE |
| quantity | INTEGER | CHECK > 0 | Units sold |
| created_at | TIMESTAMPTZ | NOT NULL | |

**RLS Policies:**
- `SELECT` — any authenticated user
- `INSERT` — ADMIN or SUPERADMIN only

---

## Migration File Index

| File | Description |
|---|---|
| `001_initial_schema.sql` | Creates all tables, RLS policies, triggers, seeds products and sales_detail |
| `002_seed_superadmin.sql` | Promotes the designated SUPERADMIN account to `user_type = SUPERADMIN, status = ACTIVE` |

---

## Notes

- Supabase `auth.users` is managed by Supabase Auth — we never insert directly into it.
- The `provision_new_user()` trigger (delivered in M4 `db/trigger-provision-user`) fires on every new `auth.users` INSERT and creates the corresponding `profiles` row as `USER / INACTIVE`.
- All tables have Row Level Security (RLS) **enabled**. Policies are exhaustive — any operation not explicitly permitted is denied by default.
