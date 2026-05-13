-- ============================================================
-- Hope PMS — Sprint 1: SUPERADMIN Seed
-- PR: db/seed-superadmin
-- Run AFTER 001_initial_schema.sql
-- Run AFTER the designated SUPERADMIN has signed in at least once
-- (so their auth.users row exists and the profile row is auto-created).
-- ============================================================

-- Promote the designated SUPERADMIN account.
-- Replace the email below with the actual SUPERADMIN email.
UPDATE public.profiles
SET
  user_type = 'SUPERADMIN',
  status    = 'ACTIVE'
WHERE email = 'jcesperanza@neu.edu.ph';

-- Verify: should return exactly 1 row
SELECT id, email, user_type, status
FROM public.profiles
WHERE email = 'jcesperanza@neu.edu.ph';
