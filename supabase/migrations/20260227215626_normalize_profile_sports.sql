-- 1. Create the many-to-many relationship table between Profile and Sport
CREATE TABLE IF NOT EXISTS public.profile_sport (
    profile_id uuid NOT NULL REFERENCES public.profile(profile_id) ON DELETE CASCADE,
    sport_id uuid NOT NULL REFERENCES public.sport(sport_id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (profile_id, sport_id)
);

-- 2. Enable RLS
ALTER TABLE public.profile_sport ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can view their own sports
CREATE POLICY "Users can view own sports" ON public.profile_sport
    FOR SELECT USING (auth.uid() = profile_id);

-- Users can insert their own sports
CREATE POLICY "Users can insert own sports" ON public.profile_sport
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Users can delete their own sports
CREATE POLICY "Users can delete own sports" ON public.profile_sport
    FOR DELETE USING (auth.uid() = profile_id);

-- 4. Drop the old hardcoded column array
ALTER TABLE public.profile
DROP COLUMN IF EXISTS sports;
