-- Add 'added_via' column to event_participants
-- Values: 'website' (self-registered) or 'manual' (added by admin)
ALTER TABLE public.event_participants
  ADD COLUMN IF NOT EXISTS added_via text NOT NULL DEFAULT 'website';

-- Backfill existing rows as 'website' (they were all self-registered before this feature)
UPDATE public.event_participants SET added_via = 'website' WHERE added_via IS NULL;
