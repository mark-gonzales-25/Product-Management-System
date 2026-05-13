# Sprint 1 Log — Hope PMS

**Sprint:** 1 of 3 | **Weeks:** 1 & 2
**Theme:** Project setup, database initialization, authentication (email + Google OAuth), and login guard.

---

## Sprint Goals

| # | Goal | Owner | Status |
|---|---|---|---|
| 1 | GitHub repo created, branching strategy documented | M1 | ✅ Done |
| 2 | Vite + React 18 + Tailwind CSS scaffolded | M1 | ✅ Done |
| 3 | Supabase client initialized, .env configured | M1 | ✅ Done |
| 4 | React Router v6 + ProtectedRoute wired | M1 | ✅ Done |
| 5 | Login page (email/password + Google button) | M2 | ✅ Done |
| 6 | Register page with all required fields | M2 | ✅ Done |
| 7 | App shell: Navbar, Sidebar with role placeholder | M2 | ✅ Done |
| 8 | /auth/callback loading page | M2 | ✅ Done |
| 9 | DB tables created: profiles, products, sales_detail | M3 | ✅ Done |
| 10 | record_status (active) + stamp columns on products | M3 | ✅ Done |
| 11 | SUPERADMIN seed row inserted | M3 | ✅ Done |
| 12 | DB schema ERD documented | M3 | ✅ Done |
| 13 | AuthContext — session listener, currentUser | M4 | ✅ Done |
| 14 | signUp() wired to Register form | M4 | ✅ Done |
| 15 | signInWithOAuth (Google) + /auth/callback login guard | M4 | ✅ Done |
| 16 | provision_new_user() trigger deployed | M4 | ✅ Done |
| 17 | Vitest + RTL configured | M5 | ✅ Done |
| 18 | Auth flow tests written (email + Google + login guard) | M5 | ✅ Done |

---

## Daily Log

### Week 1

**Day 1 (Mon)**
- M1: Created GitHub repo, configured branch protection on `main` and `dev`. Pushed initial `.gitignore` and `README.md`.
- M3: Provisioned Supabase project. Shared `anon key` and `project URL` with team via `.env.example`.

**Day 2 (Tue)**
- M1: Scaffolded Vite + React 18. Configured Tailwind CSS and verified build runs at `localhost:5173`.
- M2: Started Login page layout (brand, form structure, Google button).

**Day 3 (Wed)**
- M1: Merged `feat/project-scaffold` → dev (PR-01). Started `feat/supabase-client`.
- M3: Ran `001_initial_schema.sql` in Supabase SQL Editor. Verified all tables created. Seed products confirmed (57 rows).
- M4: Started `AuthContext` — session listener and `currentUser` state.

**Day 4 (Thu)**
- M1: Merged `feat/supabase-client` → dev (PR-02). Supabase client and ProtectedRoute confirmed working.
- M2: Login page complete. Register page started.
- M4: `AuthContext` merged. Started Google OAuth config in Google Cloud Console.

**Day 5 (Fri)**
- M1: Started `feat/routing-skeleton`. Placeholder pages wired to routes.
- M3: ERD documented. `002_seed_superadmin.sql` ready pending M4 first sign-in.
- M5: Installed Vitest + RTL. First test stub written.

### Week 2

**Day 6 (Mon)**
- M1: Merged `feat/routing-skeleton` → dev (PR-03). All placeholder routes confirmed navigable.
- M2: Register page merged (PR-02). App shell (Sidebar + Topbar) started.
- M4: Google OAuth redirect URLs configured in Supabase Dashboard for `localhost:5173` and production.

**Day 7 (Tue)**
- M2: App shell merged (PR-03). Auth callback page merged (PR-04).
- M4: `feat/auth-email-signup` merged (PR-02). `signInWithPassword` and `signUp` confirmed wired to forms.

**Day 8 (Wed)**
- M3: `db/seed-superadmin` merged after M4 confirmed first Google sign-in. SUPERADMIN promoted.
- M4: `feat/auth-google-oauth` merged (PR-03) — AuthCallbackPage with login guard logic deployed.
- **Blocker:** Google redirect URI mismatch on first OAuth test. Fixed by adding the correct callback URL to Google Cloud Console.

**Day 9 (Thu)**
- M4: `db/trigger-provision-user` merged (PR-04). Trigger tested — new Google user auto-provisioned as USER / INACTIVE.
- M5: Login guard tests complete (all 4 cases pass). Sprint 1 log drafted.

**Day 10 (Fri)**
- M5: All tests passing. `docs/sprint1-log-readme` PR opened.
- Team: Sprint 1 gate review — login guard working for both auth methods, DB fully seeded.
- **Sprint 1 Gate: PASSED ✅**

---

## Blockers & Resolutions

| # | Blocker | Resolution |
|---|---|---|
| 1 | Google OAuth redirect URI mismatch | Added `http://localhost:5173/auth/callback` to Google Cloud Console authorized URIs |
| 2 | INACTIVE users could still land on /products | Fixed in `AuthCallbackPage` — added explicit `signOut()` call before showing error |

---

## Sprint 2 Preview

- Full product CRUD (add, edit, soft-delete, recover)
- Rights enforcement (PRD_ADD, PRD_EDIT, PRD_DEL per user type)
- Soft-delete visibility rules and stamp gating
- Price history panel
- RLS policies for write operations

---

*Sprint 1 log compiled by M5 – QA / Documentation Specialist.*
