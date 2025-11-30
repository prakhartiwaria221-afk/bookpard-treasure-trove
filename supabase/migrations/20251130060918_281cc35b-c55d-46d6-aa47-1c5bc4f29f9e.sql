-- Fix Security Issue 1: Protect seller contact information in user_listings
-- Drop the existing public view policy and create a more restrictive one
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.user_listings;

-- Create a view for public users that excludes sensitive contact information
CREATE VIEW public.user_listings_public AS
SELECT 
  id,
  user_id,
  title,
  author,
  category,
  price,
  condition,
  description,
  image_url,
  status,
  created_at
FROM public.user_listings
WHERE status = 'active';

-- Allow public access to the view without contact details
GRANT SELECT ON public.user_listings_public TO anon, authenticated;

-- Create new policies for user_listings that protect contact information
CREATE POLICY "Authenticated users can view active listings with contact info"
ON public.user_listings
FOR SELECT
USING (
  status = 'active' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to view their own listings even if inactive
CREATE POLICY "Users can view their own listings"
ON public.user_listings
FOR SELECT
USING (auth.uid() = user_id);

-- Fix Security Issue 2: Prevent unauthorized access to delivery addresses in orders
-- Drop the permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;

-- Create a strict INSERT policy that ensures users can only create orders for themselves
CREATE POLICY "Users can only create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add a policy to prevent users from viewing other users' delivery addresses
-- (The existing "Users can view their own orders" policy already handles this correctly)