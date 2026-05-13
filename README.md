# Hope PMS — Production Deployment Guide

A full-stack product management system for Hope, Inc., built with React 18 + Vite + Supabase.

---

## Live Deployment Steps

### 1. Environment Variables

Set the following in Vercel/Netlify dashboard (Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Supabase Production Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration, add:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:**
  - `https://your-app.vercel.app/auth/callback`
  - `http://localhost:5173/auth/callback` (keep for local dev)

### 3. Google OAuth (Google Cloud Console)

In Google Cloud Console → Credentials → OAuth 2.0 Client, add to **Authorized redirect URIs**:
- `https://your-project.supabase.co/auth/v1/callback`

### 4. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```

Vercel auto-detects Vite. Build command: `npm run build`. Output dir: `dist`.

### 5. Netlify Deployment

```bash
npm run build
# Upload the /dist folder via Netlify UI, or use netlify-cli:
netlify deploy --prod --dir=dist
```

Add `_redirects` file in `/public` for SPA routing:
```
/*  /index.html  200
```

---

## Post-Deploy Checklist

- [x] Live URL accessible
- [x] Login with email works
- [x] Login with Google OAuth works
- [x] All 3 user types can authenticate
- [x] VITE_ env vars set (not exposed in source)
- [x] Supabase redirect URLs updated for production domain
- [x] Stale GitHub branches deleted
- [x] Final release PR (dev → main) created and merged

---

## Local Development

```bash
git clone <repo-url>
cd hope-pms
npm install
cp .env.example .env.local   # fill in your Supabase credentials
npm run dev
```

## Project Stack

- **Frontend:** Vite + React 18 + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + RLS)
- **Routing:** React Router v6
- **Charts:** Chart.js via react-chartjs-2
- **Icons:** Lucide React
