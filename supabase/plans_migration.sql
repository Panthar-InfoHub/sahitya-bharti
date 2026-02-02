-- Add plan column to users table
alter table public.users add column if not exists plan text default 'free';

-- Add check constraint for valid plan types
alter table public.users add constraint valid_plan_type check (plan in ('free', 'silver', 'premium'));

-- Update existing users to 'free' if null (though default handles new ones)
update public.users set plan = 'free' where plan is null;
