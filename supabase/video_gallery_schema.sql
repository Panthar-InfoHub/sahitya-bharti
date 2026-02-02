create table public.video_gallery (
  id uuid not null default gen_random_uuid (),
  video_url text not null,
  title text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint video_gallery_pkey primary key (id)
) tablespace pg_default;

-- Add RLS policies
alter table public.video_gallery enable row level security;

create policy "Enable read access for all users" on public.video_gallery
  for select using (true);

create policy "Enable insert for authenticated users only" on public.video_gallery
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.video_gallery
  for delete using (auth.role() = 'authenticated');
