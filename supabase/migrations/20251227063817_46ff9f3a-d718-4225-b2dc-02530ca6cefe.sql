-- Drop the SECURITY DEFINER view to resolve the linter warning
-- The app already uses the RPC function directly, so this view is redundant
DROP VIEW IF EXISTS public.user_listings_public;