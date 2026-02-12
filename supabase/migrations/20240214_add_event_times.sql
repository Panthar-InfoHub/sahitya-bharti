-- Add start_time and end_time columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME;

-- Add comment
COMMENT ON COLUMN events.start_time IS 'Event start time';
COMMENT ON COLUMN events.end_time IS 'Event end time';
