-- Create international_positions table
create table public.international_positions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  country text not null,
  city text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(country, city, title)
);

-- Enable RLS
alter table public.international_positions enable row level security;

-- Policies
create policy "Allow public read access"
  on public.international_positions
  for select
  to public
  using (true);

create policy "Allow authenticated insert"
  on public.international_positions
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update"
  on public.international_positions
  for update
  to authenticated
  using (true);

create policy "Allow authenticated delete"
  on public.international_positions
  for delete
  to authenticated
  using (true);
