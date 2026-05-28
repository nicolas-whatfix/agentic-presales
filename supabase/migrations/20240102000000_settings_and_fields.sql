create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

create table if not exists module_fields (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  field_key text not null,
  name text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  unique(module, field_key)
);

create table if not exists module_prompts (
  id uuid primary key default gen_random_uuid(),
  module text not null unique,
  prompt text not null,
  updated_at timestamptz default now()
);
