-- First, revoke ALL select permissions to start fresh
REVOKE ALL ON public.user_listings FROM authenticated;
REVOKE ALL ON public.user_listings FROM anon;

-- Grant only non-sensitive columns to authenticated users
GRANT SELECT (id, user_id, title, author, category, price, condition, description, image_url, status, created_at)
ON public.user_listings TO authenticated;

-- Grant only non-sensitive columns to anon users
GRANT SELECT (id, user_id, title, author, category, price, condition, description, image_url, status, created_at)
ON public.user_listings TO anon;

-- Keep INSERT, UPDATE, DELETE for authenticated (they need these for their own listings)
GRANT INSERT, UPDATE, DELETE ON public.user_listings TO authenticated;

-- Drop conflicting policies
DROP POLICY IF EXISTS "Authenticated can view active listings" ON public.user_listings;
DROP POLICY IF EXISTS "Owners have full access to their listings" ON public.user_listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON public.user_listings;

-- Create single SELECT policy for active listings (column grants handle what they can see)
CREATE POLICY "View active listings"
ON public.user_listings
FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

-- Update the secure function to be the ONLY way to get contact info
CREATE OR REPLACE FUNCTION public.get_listing_contact_info(listing_id uuid)
RETURNS TABLE(
  contact_email text,
  contact_phone text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ul.contact_email,
    ul.contact_phone
  FROM public.user_listings ul
  WHERE ul.id = listing_id
    AND (auth.uid() = ul.user_id OR has_role(auth.uid(), 'admin'::app_role))
$$;