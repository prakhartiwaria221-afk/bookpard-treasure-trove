-- Remove the broad "Anyone can view active listings" policy that exposes all columns
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.user_listings;

-- Revoke full SELECT from authenticated role and grant only non-sensitive columns
REVOKE SELECT ON public.user_listings FROM authenticated;
GRANT SELECT (id, user_id, title, author, category, price, condition, description, image_url, status, created_at)
ON public.user_listings TO authenticated;

-- Re-create the policy for viewing active listings (now only grants access to permitted columns)
CREATE POLICY "Authenticated can view active listings"
ON public.user_listings
FOR SELECT
TO authenticated
USING (status = 'active');

-- Owners still need full access to their own listings for editing
CREATE POLICY "Owners have full access to their listings"
ON public.user_listings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Grant full column access to service_role for admin operations
GRANT SELECT ON public.user_listings TO service_role;