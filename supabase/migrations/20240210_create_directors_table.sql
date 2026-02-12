
create table public.directors (
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

create index IF not exists idx_directors_category on public.directors using btree (category) TABLESPACE pg_default;

create index IF not exists idx_directors_order on public.directors using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_directors_active on public.directors using btree (is_active) TABLESPACE pg_default;

-- Enable RLS
ALTER TABLE directors ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read directors
CREATE POLICY "Anyone can view directors"
    ON directors
    FOR SELECT
    USING (true);

-- Admins can insert directors
CREATE POLICY "Admins can insert directors"
    ON directors
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can update directors
CREATE POLICY "Admins can update directors"
    ON directors
    FOR UPDATE
    USING (
         EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can delete directors
CREATE POLICY "Admins can delete directors"
    ON directors
    FOR DELETE
    USING (
         EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
