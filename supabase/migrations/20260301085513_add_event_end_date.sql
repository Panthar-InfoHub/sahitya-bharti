-- Add end_date column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
