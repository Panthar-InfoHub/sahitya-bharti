-- Add notifications column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS notifications text[] DEFAULT '{}';

-- Create a function to add a notification (helper)
CREATE OR REPLACE FUNCTION add_notification(user_id uuid, message text)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET notifications = array_append(notifications, message)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
