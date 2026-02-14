-- Create directors table
create table if not exists public.directors (
  id uuid not null default gen_random_uuid (),
  name text not null,
  title text not null,
  category text not null,
  photo_url text null,
  bio text null,
  email text null,
  phone text null,
  linkedin_url text null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint directors_pkey primary key (id),
  constraint directors_category_check check (
    (
      category = any (array['national'::text, 'international'::text])
    )
  )
) TABLESPACE pg_default;

-- Create indexes
create index IF not exists idx_directors_category on public.directors using btree (category) TABLESPACE pg_default;
create index IF not exists idx_directors_order on public.directors using btree (display_order) TABLESPACE pg_default;
create index IF not exists idx_directors_active on public.directors using btree (is_active) TABLESPACE pg_default;

-- Enable RLS
alter table public.directors enable row level security;

-- Create policies
create policy "Enable read access for all users"
on public.directors for select
using (true);

create policy "Enable insert for authenticated users only"
on public.directors for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
on public.directors for update
using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only"
on public.directors for delete
using (auth.role() = 'authenticated');
