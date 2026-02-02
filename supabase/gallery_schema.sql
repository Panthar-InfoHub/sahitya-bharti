create table public.gallery_images (
  id uuid not null default gen_random_uuid (),
  image_url text not null,
  caption text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint gallery_images_pkey primary key (id)
) tablespace pg_default;

-- Add RLS policies (optional but good practice)
alter table public.gallery_images enable row level security;

create policy "Enable read access for all users" on public.gallery_images
  for select using (true);

create policy "Enable insert for authenticated users only" on public.gallery_images
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.gallery_images
  for delete using (auth.role() = 'authenticated');
