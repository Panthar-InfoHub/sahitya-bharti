-- Create Positions Table
create table public.positions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  state text not null,
  city text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(state, city, title)
);

-- Enable RLS
alter table public.positions enable row level security;

-- Policies
create policy "Public positions are viewable by everyone"
  on public.positions for select
  using ( true );

create policy "Admins can insert positions"
  on public.positions for insert
  with check (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

create policy "Admins can update positions"
  on public.positions for update
  using (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

create policy "Admins can delete positions"
  on public.positions for delete
  using (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
