# Sprint 2 Log — Product CRUD, Rights Enforcement & Soft Delete Visibility

**Sprint Period:** Weeks 3 – 4  
**Theme:** Full product CRUD with price history, rights enforcement, soft-delete visibility rules, and stamp gating.  
**Team:** M1 (Project Lead), M2 (Frontend Dev), M3 (DB Engineer), M4 (Rights & Auth), M5 (QA/Docs)

---

## Daily Summary

### Day 1 (Week 3, Mon)
- **M1**: Started `productService.ts` — `getProducts()`, `addProduct()`, `softDeleteProduct()`, `recoverProduct()`.
- **M3**: Drafted `004_rls_product_select.sql` — role-aware SELECT policy for products.
- **M4**: Scaffolded `UserRightsContext.tsx` with `deriveRights()` and `useRights()` hook.

### Day 2 (Week 3, Tue)
- **M1**: Completed `updateProduct()`, opened PR-01 (`feat/product-api`). Merged after review by M4.
- **M3**: Opened PR-01 (`db/rls-product-select`). Tested via Supabase SQL Editor with USER impersonation — only active rows returned. ✅
- **M4**: Opened PR-01 (`feat/rights-context`), wired `UserRightsProvider` into `main.tsx`. Merged.

### Day 3 (Week 3, Wed)
- **M1**: Started `priceHistService.ts` (`getPriceHistory`, `addPriceEntry`). Opened PR-02.
- **M3**: Opened PR-02 (`db/rls-product-write`) — INSERT + UPDATE policies. Tested ADMIN insert ✅, USER insert rejected by RLS ✅.
- **M2**: Began `ProductsPage` with table columns: prodCode, description, unit, price. Stamp column hidden from USER.
- **M5**: Set up test scaffolding for rights matrix.

### Day 4 (Week 3, Thu)
- **M2**: Opened PR-01 (`feat/ui-product-list`). Merged after M1 review.
- **M4**: Opened PR-02 (`feat/rights-ui-gating`) — Add/Edit/Delete buttons gated by `useRights()`.
- **M5**: Ran 18-case rights matrix. All 18 passed. Documented results.

### Day 5 (Week 3, Fri)
- **M2**: Wired AddProductModal, EditProductModal, SoftDeleteConfirmDialog. Opened PR-02 (`feat/ui-product-crud`).
- **M4**: Opened PR-03 (`feat/rights-sidebar`) — Deleted Items and Admin links hidden from USER.
- **M5**: Opened PR-01 (`test/sprint2-rights-matrix`). Merged.

### Day 6 (Week 4, Mon)
- **M2**: Built `PriceHistoryPanel` + `AddPriceEntryForm` using `priceHistService`. Opened PR-03 (`feat/ui-price-history`).
- **M3**: Started `006_view_current_price.sql` — `price_history` table + `current_product_price` view.
- **M1**: Opened PR-03 (`feat/route-guard-deleted`) — `AdminRoute` component, `DashboardLayout` updated. Merged.

### Day 7 (Week 4, Tue)
- **M3**: Opened PR-03 (`db/view-current-price`). Tested: `SELECT * FROM current_product_price LIMIT 5` returns latest prices. ✅
- **M2**: Opened PR-04 (`feat/ui-deleted-items`) — `DeletedPage` with stamp column (ADMIN/SUPERADMIN only) and Recover button.
- **M5**: Ran soft-delete visibility tests. All 6 passed. Opened PR-02 (`test/sprint2-softdelete-visibility`). Merged.

### Day 8 (Week 4, Wed)
- **M5**: No-hard-delete audit: `grep -rn ".delete(" src/services/` → 0 results on product/user tables. ✅
- **M5**: Direct API bypass test: simulated USER calling `getProducts` without `active=true` filter → RLS blocks INACTIVE rows. ✅
- All PRs reviewed and merged. Sprint 2 gate checks completed.

---

## Sprint 2 Gate — Checklist

| Check | Result | Notes |
|-------|--------|-------|
| 18 rights test cases passed | ✅ PASS | See `sprint2-rights-matrix.test.ts` |
| USER cannot see INACTIVE products (UI) | ✅ PASS | `active=true` filter in `getProducts('USER')` |
| USER cannot see INACTIVE products (RLS) | ✅ PASS | DB policy tested via Supabase SQL impersonation |
| Soft-delete records stamp (deleted_by + deleted_at) | ✅ PASS | TC-SD-01 |
| Stamp column hidden from USER | ✅ PASS | TC-SD-04 |
| ADMIN can recover soft-deleted product | ✅ PASS | TC-SD-05 |
| USER sees recovered product | ✅ PASS | Active flag returns true → appears in USER's list |
| No hard DELETE calls in codebase | ✅ PASS | TC-SD-06 + manual grep |
| Deleted Items page blocked for USER | ✅ PASS | `AdminRoute` guard redirects USER to /products |

---

## Blockers & Resolutions

| Blocker | Resolution |
|---------|-----------|
| `price_history` table not yet created at start of sprint | M3 created it in migration `006` mid-sprint; `priceHistService` imported only after M3 PR-03 merged |
| `useRights()` hook consumed before `UserRightsProvider` wrapped app | M4 PR-01 wired provider into `main.tsx`; resolved immediately |
| RLS UPDATE policy initially too broad (allowed any authenticated update) | M3 tightened check in `005_rls_product_write.sql` to require user_type IN ('ADMIN','SUPERADMIN') |

---

## Next Steps (Sprint 3)

- [ ] Build `ProductReportPage` (REP_001) with `current_product_price` view
- [ ] Build `TopSellingPage` (REP_002) with `top_selling_products` view
- [ ] Build `UserManagementPage` (Admin module) with SUPERADMIN row protection
- [ ] Deploy to Vercel/Netlify with production Supabase env vars
- [ ] Final documentation and user manual
