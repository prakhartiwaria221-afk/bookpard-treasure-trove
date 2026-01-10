-- Add policy to allow authenticated users to view active listings
CREATE POLICY "Anyone can view active listings" 
ON public.user_listings 
FOR SELECT 
TO authenticated
USING (status = 'active');

-- Create a secure function to get public listings with contact info hidden
CREATE OR REPLACE FUNCTION public.get_public_listings_secure()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  author text,
  category text,
  condition text,
  description text,
  image_url text,
  price integer,
  status text,
  created_at timestamp with time zone,
  contact_email text,
  contact_phone text,
  is_owner boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ul.id,
    ul.user_id,
    ul.title,
    ul.author,
    ul.category,
    ul.condition,
    ul.description,
    ul.image_url,
    ul.price,
    ul.status,
    ul.created_at,
    -- Only show contact info to owner or admin
    CASE 
      WHEN auth.uid() = ul.user_id OR has_role(auth.uid(), 'admin'::app_role) 
      THEN ul.contact_email 
      ELSE NULL 
    END as contact_email,
    CASE 
      WHEN auth.uid() = ul.user_id OR has_role(auth.uid(), 'admin'::app_role) 
      THEN ul.contact_phone 
      ELSE NULL 
    END as contact_phone,
    (auth.uid() = ul.user_id) as is_owner
  FROM public.user_listings ul
  WHERE ul.status = 'active'
  ORDER BY ul.created_at DESC
$$;