-- Drop existing SELECT policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new PERMISSIVE SELECT policies (using PERMISSIVE so either condition allows access)
-- Policy 1: Users can view only their own profile (requires authentication)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles (requires authentication and admin role)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));