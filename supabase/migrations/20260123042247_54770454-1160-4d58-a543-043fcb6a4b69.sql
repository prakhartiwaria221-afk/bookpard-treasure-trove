-- Fix overly permissive RLS policies

-- Drop the permissive policies
DROP POLICY IF EXISTS "System can create alerts" ON public.inventory_alerts;
DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;

-- Create proper policies for inventory_alerts (use service role or triggers)
CREATE POLICY "Admins can manage all alerts" 
ON public.inventory_alerts FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- For email_logs, only allow authenticated system operations via service role
-- Regular users cannot insert, only admins can view
CREATE POLICY "Admins can manage email logs" 
ON public.email_logs FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));