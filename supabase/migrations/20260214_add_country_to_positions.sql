-- Add country column to positions table
ALTER TABLE public.positions ADD COLUMN IF NOT EXISTS country text DEFAULT 'India' NOT NULL;

-- Make state nullable (or just allow empty strings, but nullable is semantically correct for 'no state')
ALTER TABLE public.positions ALTER COLUMN state DROP NOT NULL;
ALTER TABLE public.positions ALTER COLUMN state SET DEFAULT '';

-- Drop old unique constraint
ALTER TABLE public.positions DROP CONSTRAINT IF EXISTS positions_state_city_title_key;

-- Add new unique constraint including country
DROP INDEX IF EXISTS positions_country_state_city_title_idx;
CREATE UNIQUE INDEX positions_country_state_city_title_idx ON public.positions (country, COALESCE(state, ''), city, title);

-- Add nation column to members table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS nation text DEFAULT 'India';
ALTER TABLE public.members ALTER COLUMN state DROP NOT NULL;
ALTER TABLE public.members ALTER COLUMN state SET DEFAULT '';
