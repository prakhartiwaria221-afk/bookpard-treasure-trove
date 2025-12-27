-- Drop the overly permissive policy that exposes contact info
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.user_listings;

-- Create a SECURITY DEFINER function for safe public access (excludes contact info)
CREATE OR REPLACE FUNCTION public.get_active_user_listings()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  price integer,
  created_at timestamptz,
  author text,
  condition text,
  description text,
  image_url text,
  status text,
  category text,
  title text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    price,
    created_at,
    author,
    condition,
    description,
    image_url,
    status,
    category,
    title
  FROM public.user_listings
  WHERE status = 'active'
$$;