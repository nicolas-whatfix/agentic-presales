# saas-app-template

A generic, reusable Vite + React + TypeScript + Supabase starter. Duplicate this repo for each new project.

## Stack

- Vite + React 19 + TypeScript
- Supabase (anon key only in frontend)
- Plain CSS (no UI library)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings.

3. **Create the sample table** *(optional — for the DB test page)*
   Run [supabase/migrations/20240101000000_create_items.sql](supabase/migrations/20240101000000_create_items.sql) in the Supabase SQL editor.

4. **Start dev server**
   ```bash
   npm run dev
   ```

## Structure

```
src/
  components/
    layout/   # AppShell, Nav
    ui/        # Button, reusable primitives
  hooks/       # Data-fetching hooks
  lib/         # supabase.ts client
  pages/       # Dashboard, DbTest (and your future pages)
  types/       # Shared TypeScript types
supabase/
  functions/   # Edge functions (scaffolded)
  migrations/  # SQL migration files
```

## Duplicating for a new project

1. Copy this folder (or use it as a GitHub template)
2. Update `name` in `package.json`
3. Update the title in `index.html`
4. Create a new Supabase project and fill in `.env`
5. Delete or replace the `items` example with your own tables
