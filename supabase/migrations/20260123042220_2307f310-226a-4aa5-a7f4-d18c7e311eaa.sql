-- Add tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_order_updates BOOLEAN DEFAULT true,
  email_price_drops BOOLEAN DEFAULT true,
  email_back_in_stock BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for notification_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.notification_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.notification_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.notification_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Create price watch table
CREATE TABLE public.price_watches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.user_listings(id) ON DELETE CASCADE,
  target_price INTEGER,
  notify_any_drop BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notified_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT price_watch_book_or_listing CHECK (
    (book_id IS NOT NULL AND listing_id IS NULL) OR 
    (book_id IS NULL AND listing_id IS NOT NULL)
  )
);

-- Enable RLS on price_watches
ALTER TABLE public.price_watches ENABLE ROW LEVEL SECURITY;

-- Policies for price_watches
CREATE POLICY "Users can view their own price watches" 
ON public.price_watches FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price watches" 
ON public.price_watches FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price watches" 
ON public.price_watches FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price watches" 
ON public.price_watches FOR DELETE 
USING (auth.uid() = user_id);

-- Add inventory fields to user_listings
ALTER TABLE public.user_listings 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS notify_low_stock BOOLEAN DEFAULT true;

-- Create inventory alerts table
CREATE TABLE public.inventory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.user_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'low_stock',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on inventory_alerts
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for inventory_alerts
CREATE POLICY "Users can view their own alerts" 
ON public.inventory_alerts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts" 
ON public.inventory_alerts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own alerts" 
ON public.inventory_alerts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
ON public.inventory_alerts FOR DELETE 
USING (auth.uid() = user_id);

-- Create email logs table for tracking sent emails
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'sent',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for email_logs (admin only)
CREATE POLICY "Admins can view all email logs" 
ON public.email_logs FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert email logs" 
ON public.email_logs FOR INSERT 
WITH CHECK (true);

-- Function to check and create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.low_stock_threshold AND NEW.notify_low_stock = true THEN
    INSERT INTO public.inventory_alerts (listing_id, user_id, alert_type)
    VALUES (NEW.id, NEW.user_id, 'low_stock')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for low stock alerts
DROP TRIGGER IF EXISTS check_low_stock_trigger ON public.user_listings;
CREATE TRIGGER check_low_stock_trigger
AFTER UPDATE OF stock_quantity ON public.user_listings
FOR EACH ROW
EXECUTE FUNCTION check_low_stock_alert();

-- Function to log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_history = COALESCE(OLD.status_history, '[]'::jsonb) || 
      jsonb_build_object(
        'status', NEW.status,
        'timestamp', now(),
        'previous_status', OLD.status
      );
    NEW.last_status_update = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for order status history
DROP TRIGGER IF EXISTS log_order_status_trigger ON public.orders;
CREATE TRIGGER log_order_status_trigger
BEFORE UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();