-- Create trustees table
create table if not exists public.trustees (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null,
  address text null,
  email text null,
  phone text null,
  type text not null, -- 'national' or 'international'
  photo_url text null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint trustees_pkey primary key (id),
  constraint trustees_type_check check (
    (
      type = any (array['national'::text, 'international'::text])
    )
  )
) TABLESPACE pg_default;

-- Create indexes
create index IF not exists idx_trustees_type on public.trustees using btree (type) TABLESPACE pg_default;
create index IF not exists idx_trustees_order on public.trustees using btree (display_order) TABLESPACE pg_default;
create index IF not exists idx_trustees_active on public.trustees using btree (is_active) TABLESPACE pg_default;

-- Enable RLS
alter table public.trustees enable row level security;

-- Create policies
create policy "Enable read access for all users"
on public.trustees for select
using (true);

create policy "Enable insert for authenticated users only"
on public.trustees for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on public.trustees for update
using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only"
on public.trustees for delete
using (auth.role() = 'authenticated');
