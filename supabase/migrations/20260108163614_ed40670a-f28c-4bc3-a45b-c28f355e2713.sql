-- Fix get_admin_users function - add admin authorization check
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(user_id uuid, email text, role app_role, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.user_id,
    au.email,
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
    AND has_role(auth.uid(), 'admin'::app_role)
  ORDER BY ur.created_at DESC
$$;

-- Fix get_user_id_by_email function - add admin authorization check
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN
      (SELECT id FROM auth.users WHERE email = _email LIMIT 1)
    ELSE NULL
  END
$$;