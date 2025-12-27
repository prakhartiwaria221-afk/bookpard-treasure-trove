-- Drop the policy that exposes contact info to anonymous users
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.user_listings;

-- The existing policies remain:
-- "Authenticated users can view active listings with contact info" - for logged-in users
-- "Users can view their own listings" - for owners
-- "Admins can manage all listings" - for admins
-- The user_listings_public view (without contact info) should be used for anonymous/public access