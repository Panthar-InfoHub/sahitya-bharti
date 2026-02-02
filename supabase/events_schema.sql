-- Create Events Table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text not null,
  image_url text,
  seats integer,
  prizes text,
  rules text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id)
);

-- Create Event Participants Table
create table public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.event_participants enable row level security;

-- Policies for Events
-- Public can view events
create policy "Public events are viewable by everyone"
  on public.events for select
  using ( true );

-- Admins can insert/update/delete events
create policy "Admins can insert events"
  on public.events for insert
  with check (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

create policy "Admins can update events"
  on public.events for update
  using (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

create policy "Admins can delete events"
  on public.events for delete
  using (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Policies for Participants
-- Public/Auth can view participants (or maybe just joined count? For now allowing view)
create policy "Participants are viewable by everyone"
  on public.event_participants for select
  using ( true );

-- Auth users can join (insert)
create policy "Users can join events"
  on public.event_participants for insert
  with check ( auth.uid() = user_id );

-- Auth users can leave (delete)
create policy "Users can leave events"
  on public.event_participants for delete
  using ( auth.uid() = user_id );
