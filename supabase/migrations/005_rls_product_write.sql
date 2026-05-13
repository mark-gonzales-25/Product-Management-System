-- ============================================================
-- Sprint 2 — RLS: Product write policies (INSERT + UPDATE)
-- Implements fine-grained per-right enforcement via profiles.
-- ============================================================

-- ── INSERT: only users with user_type ADMIN or SUPERADMIN ──
DROP POLICY IF EXISTS "Products: admin insert" ON public.products;

CREATE POLICY "Products: admin insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN', 'SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

-- ── UPDATE (edit fields): ADMIN or SUPERADMIN only ─────────
DROP POLICY IF EXISTS "Products: admin update" ON public.products;

CREATE POLICY "Products: admin or superadmin update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN', 'SUPERADMIN')
        AND status = 'ACTIVE'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN', 'SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

-- ── RECOVERY (active → true): ADMIN or SUPERADMIN only ─────
-- Recovery is the same UPDATE policy — covered above.
-- The UI enforces recovery is only on the DeletedItems page,
-- which is behind AdminRoute.

-- Note: Hard DELETE intentionally kept restricted to SUPERADMIN
-- from the original migration. No changes needed here.

-- Verification:
-- 1. As USER: attempt INSERT into products → should be rejected by RLS
-- 2. As ADMIN: INSERT a product → should succeed
-- 3. As USER: attempt UPDATE on any product → should be rejected
-- 4. As ADMIN: soft-delete (UPDATE active=false) → should succeed
-- 5. As ADMIN: recover (UPDATE active=true) → should succeed
