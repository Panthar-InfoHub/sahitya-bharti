-- Add price column to events table
alter table public.events add column if not exists price numeric default 0;

-- Optional: Add status column to event_participants to track payment status?
-- Ideally we should, e.g. 'registered', 'paid', 'pending'.
-- For now, we assume simple flow: Entry in participants table means registered (and paid if price > 0).
