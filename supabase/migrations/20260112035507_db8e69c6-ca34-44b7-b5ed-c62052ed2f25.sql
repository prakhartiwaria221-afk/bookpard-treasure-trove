-- Drop existing UPDATE policy on profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate with TO authenticated to ensure only logged-in users can update
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);