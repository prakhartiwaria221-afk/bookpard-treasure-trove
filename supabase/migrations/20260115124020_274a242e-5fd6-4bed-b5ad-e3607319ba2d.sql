-- =============================================
-- PHASE 2: TRUST & DISCOVERY FEATURES
-- =============================================

-- 1. BOOK REVIEWS & RATINGS TABLE
CREATE TABLE public.book_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, user_id) -- One review per user per book
);

-- Enable RLS
ALTER TABLE public.book_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for book_reviews
CREATE POLICY "Anyone can view reviews"
ON public.book_reviews
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.book_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.book_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.book_reviews
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
ON public.book_reviews
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. FEATURED BOOKS TABLE (Book of the Week, Collections)
CREATE TABLE public.featured_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('book_of_week', 'staff_pick', 'trending', 'new_arrival')),
  title TEXT, -- Optional custom title for the feature
  description TEXT, -- Why this book is featured
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE, -- NULL means no end date
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(book_id, feature_type, start_date)
);

-- Enable RLS
ALTER TABLE public.featured_books ENABLE ROW LEVEL SECURITY;

-- RLS Policies for featured_books
CREATE POLICY "Anyone can view active featured books"
ON public.featured_books
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage featured books"
ON public.featured_books
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. SELLER PROFILES TABLE
CREATE TABLE public.seller_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  total_sales INTEGER NOT NULL DEFAULT 0,
  response_rate DECIMAL(5,2), -- Percentage
  avg_rating DECIMAL(3,2), -- Calculated average
  total_ratings INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_profiles
CREATE POLICY "Anyone can view seller profiles"
ON public.seller_profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own seller profile"
ON public.seller_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile"
ON public.seller_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all seller profiles"
ON public.seller_profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. SELLER RATINGS TABLE
CREATE TABLE public.seller_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(seller_id, buyer_id, order_id)
);

-- Enable RLS
ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_ratings
CREATE POLICY "Anyone can view seller ratings"
ON public.seller_ratings
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create ratings"
ON public.seller_ratings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own ratings"
ON public.seller_ratings
FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id);

CREATE POLICY "Users can delete their own ratings"
ON public.seller_ratings
FOR DELETE
TO authenticated
USING (auth.uid() = buyer_id);

-- 5. FUNCTION: Get book average rating
CREATE OR REPLACE FUNCTION public.get_book_rating(book_uuid UUID)
RETURNS TABLE(avg_rating DECIMAL(3,2), total_reviews INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating)::DECIMAL, 2), 0) as avg_rating,
    COUNT(*)::INTEGER as total_reviews
  FROM public.book_reviews
  WHERE book_id = book_uuid
$$;

-- 6. FUNCTION: Update seller average rating (trigger helper)
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.seller_profiles
  SET 
    avg_rating = (
      SELECT ROUND(AVG(rating)::DECIMAL, 2)
      FROM public.seller_ratings
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.seller_ratings
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    )
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. TRIGGER: Auto-update seller rating on review changes
CREATE TRIGGER update_seller_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.seller_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_seller_rating();