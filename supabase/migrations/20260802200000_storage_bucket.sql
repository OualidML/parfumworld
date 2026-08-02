-- Register storage bucket perfumes if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('perfumes', 'perfumes', true)
ON CONFLICT (id) DO NOTHING;

-- Cleanup existing policies to avoid migration errors
DROP POLICY IF EXISTS "Allow public read access on perfumes bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin write access on perfumes bucket" ON storage.objects;

-- Create policy for public reading of uploaded perfume files
CREATE POLICY "Allow public read access on perfumes bucket"
ON storage.objects FOR SELECT USING (bucket_id = 'perfumes');

-- Create policy for admin write access (create/update/delete)
CREATE POLICY "Allow admin write access on perfumes bucket"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'perfumes' AND is_admin())
WITH CHECK (bucket_id = 'perfumes' AND is_admin());
