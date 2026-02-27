-- Add is_admin column to profile table to manage calendar events permissions
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profile.is_admin IS 'Indicates if the user has administrative privileges to create or delete calendar events.';
