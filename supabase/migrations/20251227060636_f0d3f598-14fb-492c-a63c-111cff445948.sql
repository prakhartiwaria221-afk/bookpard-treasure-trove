-- Drop the policy that exposes contact info to all authenticated users
DROP POLICY IF EXISTS "Authenticated users can view active listings with contact info" ON public.user_listings;

-- Remaining policies ensure:
-- "Users can view their own listings" - owners see their own listings with contact info
-- "Admins can manage all listings" - admins see everything
-- For browsing listings, use the user_listings_public view which excludes contact info