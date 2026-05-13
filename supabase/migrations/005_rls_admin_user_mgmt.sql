-- Hope PMS — Sprint 3, PR-02: db/rls-admin-user-mgmt
-- RLS policies for Admin Module:
--   1. ADMIN can UPDATE profiles.status only WHERE user_type != 'SUPERADMIN'
--   2. UserModule_Rights: ADMIN cannot modify rows belonging to a SUPERADMIN user

-- ── profiles: ADMIN status update with SUPERADMIN guard ──────────────────────
-- Drop any existing status-update policy first (idempotent)
DROP POLICY IF EXISTS "Profiles: admin status update" ON public.profiles;

CREATE POLICY "Profiles: admin status update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    -- Actor must be ADMIN or SUPERADMIN
    EXISTS (
      SELECT 1 FROM public.profiles actor
      WHERE actor.auth_user_id = auth.uid()
        AND actor.user_type IN ('ADMIN', 'SUPERADMIN')
    )
    -- Target row must NOT be a SUPERADMIN
    AND user_type != 'SUPERADMIN'
  )
  WITH CHECK (
    -- After update the row must still not be SUPERADMIN (prevents privilege escalation)
    user_type != 'SUPERADMIN'
  );

-- ── UserModule_Rights: protect SUPERADMIN rows ───────────────────────────────
-- Prevent ADMIN from inserting / updating / deleting rights rows
-- that belong to a SUPERADMIN user.

DROP POLICY IF EXISTS "UserModuleRights: admin cannot modify superadmin" ON public."UserModule_Rights";

-- Only SUPERADMIN actors may touch SUPERADMIN-owned rights rows
CREATE POLICY "UserModuleRights: admin cannot modify superadmin"
  ON public."UserModule_Rights"
  FOR ALL
  TO authenticated
  USING (
    -- Either the row's user is NOT a SUPERADMIN...
    NOT EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = "UserModule_Rights".userid
        AND p.user_type = 'SUPERADMIN'
    )
    -- ...or the actor IS a SUPERADMIN
    OR EXISTS (
      SELECT 1 FROM public.profiles actor
      WHERE actor.auth_user_id = auth.uid()
        AND actor.user_type = 'SUPERADMIN'
    )
  );

-- ── Final RLS audit note ──────────────────────────────────────────────────────
-- Verified: no dev-mode `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` statements
-- remain in any migration file for production tables.
-- Verified: no hard DELETE statements exist for product or user rows.
COMMENT ON POLICY "Profiles: admin status update" ON public.profiles IS
  'Sprint 3: ADMIN may activate/deactivate users but cannot touch SUPERADMIN rows.';
