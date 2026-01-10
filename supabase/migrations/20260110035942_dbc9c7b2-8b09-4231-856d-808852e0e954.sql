-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own listings" ON public.user_listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.user_listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.user_listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.user_listings;
DROP POLICY IF EXISTS "Admins can manage all listings" ON public.user_listings;

-- Create PERMISSIVE policies for users (default is PERMISSIVE)
CREATE POLICY "Users can view their own listings" 
ON public.user_listings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listings" 
ON public.user_listings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.user_listings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.user_listings 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create PERMISSIVE policy for admins
CREATE POLICY "Admins can manage all listings" 
ON public.user_listings 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));