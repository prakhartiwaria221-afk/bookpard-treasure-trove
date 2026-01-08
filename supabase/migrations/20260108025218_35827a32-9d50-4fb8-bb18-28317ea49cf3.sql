-- Create a public function to get active listings WITHOUT contact information
-- This allows anyone to browse listings without exposing sensitive contact data
CREATE OR REPLACE FUNCTION public.get_public_user_listings()
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
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    title,
    author,
    category,
    condition,
    description,
    image_url,
    price,
    status,
    created_at
  FROM public.user_listings
  WHERE status = 'active'
  ORDER BY created_at DESC
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_user_listings() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_user_listings() TO authenticated;