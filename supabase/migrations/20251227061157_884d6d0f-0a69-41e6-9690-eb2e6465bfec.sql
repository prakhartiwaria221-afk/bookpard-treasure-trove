-- Add public SELECT policy for active listings
-- The user_listings_public view excludes contact_email and contact_phone, 
-- so buyers can browse listings without seeing seller contact info
CREATE POLICY "Anyone can view active listings"
ON public.user_listings
FOR SELECT
USING (status = 'active');