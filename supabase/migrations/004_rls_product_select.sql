-- ============================================================
-- Sprint 2 — RLS: Product SELECT policy
-- USER sees only ACTIVE products; ADMIN/SUPERADMIN see all.
-- ============================================================

-- Drop the existing generic read policy and replace with role-aware one
DROP POLICY IF EXISTS "Products: authenticated read" ON public.products;

-- USER: can only read active products
CREATE POLICY "Products: user select active"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    active = true
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid()
        AND user_type IN ('ADMIN', 'SUPERADMIN')
        AND status = 'ACTIVE'
    )
  );

-- Verification queries (run manually in Supabase SQL editor):
-- 1. Set role to a USER auth_user_id, run: SELECT * FROM products; → should return only active=true rows
-- 2. Set role to an ADMIN auth_user_id, run: SELECT * FROM products; → should return all rows including inactive
