-- Drop the unique constraint on (state, city, name)
ALTER TABLE public.positions
DROP CONSTRAINT IF EXISTS positions_state_city_name_key;

-- Drop state and city columns
ALTER TABLE public.positions
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS city;

-- Clear duplicates to allow unique constraint on name (keeping only the earliest record for each name)
DELETE FROM public.positions a USING (
    SELECT id, name
    FROM (
        SELECT id, name,
        ROW_NUMBER() OVER(PARTITION BY name ORDER BY created_at ASC) as rn
        FROM public.positions
    ) t
    WHERE t.rn = 1
) b
WHERE a.name = b.name 
AND a.id <> b.id;

-- Ensure all position names are unique
ALTER TABLE public.positions
ADD CONSTRAINT positions_name_key UNIQUE (name);
