-- Drop the existing view and recreate it to use the safe function
DROP VIEW IF EXISTS public.user_listings_public;

-- Create the public view backed by the safe function (no contact columns)
CREATE VIEW public.user_listings_public AS
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
FROM public.get_active_user_listings();

-- Allow anyone (anon + authenticated) to read the public listings view
GRANT SELECT ON public.user_listings_public TO anon, authenticated;

-- Ensure anon/authenticated can execute the safe function
GRANT EXECUTE ON FUNCTION public.get_active_user_listings() TO anon, authenticated;