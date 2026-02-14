-- Create contacts table
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table contacts enable row level security;

-- Allow public inserts (anyone can send a message)
create policy "Allow public insert to contacts"
  on contacts for insert
  with check (true);

-- Allow admins to read (adjust logic as needed, for now allowing authenticated read or just leaving it restricted to service role/admin)
-- For this specific requirement "send contact us", we mainly need INSERT. 
-- Adding a policy for admins to read would be good practice.
-- Assuming an 'admin' role or specific users, but since we haven't strictly defined admin RBAC in this chat, 
-- we will just allow the service role (which bypasses RLS) and maybe authenticated users can see their own messages if needed.
-- For now, purely public insert is the requirement.

-- Optional: Allow users to see their own messages
create policy "Allow users to view their own messages"
  on contacts for select
  using (auth.uid() = user_id);
