-- Create the items table used by the DB test page
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.items enable row level security;

-- Allow anon reads and inserts (adjust to your needs)
create policy "anon can read items"
  on public.items for select
  to anon
  using (true);

create policy "anon can insert items"
  on public.items for insert
  to anon
  with check (true);
