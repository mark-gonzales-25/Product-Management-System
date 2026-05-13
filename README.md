# MLR-AZ PMS — Product Management System

A full-stack product management system for Hope, Inc., built with React 18 + Vite + Supabase.

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/hope-pms.git
cd hope-pms
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your **Supabase Dashboard → Project Settings → API**.

### 3. Run the database migration

In **Supabase Dashboard → SQL Editor**, paste and run in order:

1. `supabase/migrations/001_initial_schema.sql` — creates tables, RLS policies, seeds data
2. `supabase/migrations/003_trigger_provision_user.sql` — deploys the auto-provisioning trigger

### 4. Enable Google OAuth

1. Go to **Authentication → Providers → Google** in your Supabase Dashboard.
2. Enable Google and paste your **Client ID** and **Client Secret** from the [Google Cloud Console](https://console.cloud.google.com).
3. Set **Authorised redirect URI** in Google Cloud Console to:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. In **Supabase → Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:5173`
   - Redirect URL: `http://localhost:5173/auth/callback`

### 5. Seed the SUPERADMIN

After your first sign-in, run in Supabase SQL Editor:

```bash
# Replace with the actual SUPERADMIN email, then run:
supabase/migrations/002_seed_superadmin.sql
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Running Tests

```bash
npm run test
```

Tests are located in `src/test/`. Sprint 1 tests cover authentication flows (email sign-up, Google OAuth, login guard).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Routing | React Router v6 |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| Auth | Google OAuth, Email/Password |
| Testing | Vitest, React Testing Library |

---

## Branching Strategy

```
main      ← Production. Tagged releases only. Never commit directly.
  └── dev ← Integration. All feature branches merge here via PR.
        ├── feat/my-feature   (M1/M2/M4)
        ├── fix/bug-name      (any member)
        ├── db/migration-name (M3)
        ├── test/test-name    (M5)
        └── docs/doc-name     (M5)
```

All work must go through a Pull Request. PRs require at least one reviewer approval before merging into `dev`.
