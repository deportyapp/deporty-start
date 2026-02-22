-- 1. Añadir columna a la tabla profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Crear el bucket en Storage para las fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear políticas de seguridad (RLS) para el bucket
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid() = owner
);

CREATE POLICY "Users can update their own avatar."
ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid() = owner
);
