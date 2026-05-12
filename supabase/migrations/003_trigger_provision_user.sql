-- ============================================================
-- Hope PMS — Sprint 1: provision_new_user() Trigger
-- PR: db/trigger-provision-user
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Function: provision_new_user()
-- Fires after every INSERT on auth.users (i.e., every new registration).
-- Creates a matching profiles row as USER / INACTIVE.
-- The SUPERADMIN must manually activate accounts via the Admin Module.
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
  v_email    TEXT;
BEGIN
  v_email    := NEW.email;
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(v_email, '@', 1),
    'user'
  );

  INSERT INTO public.profiles (auth_user_id, username, email, user_type, status)
  VALUES (NEW.id, v_username, v_email, 'USER', 'INACTIVE')
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.provision_new_user();

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running, confirm the trigger exists:
SELECT trigger_name, event_object_table, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- After a new user registers (email or Google), confirm auto-provisioning:
-- SELECT id, email, user_type, status FROM public.profiles ORDER BY created_at DESC LIMIT 5;
