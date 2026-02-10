-- Add status column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'आगामी' CHECK (status IN ('आगामी', 'चल रहा है', 'समाप्त'));

-- Add comment to explain the column
COMMENT ON COLUMN events.status IS 'Event status: आगामी (Upcoming), चल रहा है (Ongoing), समाप्त (Ended)';
