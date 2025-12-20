-- Tighten storage upload policy to only allow uploads inside the user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload book images" ON storage.objects;
CREATE POLICY "Authenticated users can upload their own book images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'book-images'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Make the public listings view run with invoker permissions (fixes SECURITY DEFINER VIEW linter)
ALTER VIEW public.user_listings_public SET (security_invoker = true);

-- Allow anyone to read active listings rows (column-level privileges below prevent PII exposure for anon)
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.user_listings;
CREATE POLICY "Anyone can view active listings"
ON public.user_listings
FOR SELECT
USING (status = 'active');

-- Restrict anon role from selecting contact details (PII) while still allowing public listing fields
REVOKE SELECT ON public.user_listings FROM anon;
GRANT SELECT (id, user_id, title, author, category, price, condition, description, image_url, status, created_at)
ON public.user_listings TO anon;

-- Ensure the public view itself is selectable
GRANT SELECT ON public.user_listings_public TO anon, authenticated;