CREATE TYPE public.reading_status AS ENUM ('want_to_read', 'reading', 'finished');

CREATE TABLE public.reading_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_title TEXT NOT NULL,
  book_author TEXT NOT NULL,
  book_image TEXT,
  status public.reading_status NOT NULL DEFAULT 'want_to_read',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_lists TO authenticated;
GRANT ALL ON public.reading_lists TO service_role;

ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own shelf" ON public.reading_lists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add to own shelf" ON public.reading_lists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own shelf" ON public.reading_lists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove from own shelf" ON public.reading_lists FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_reading_lists_user ON public.reading_lists(user_id, status);

CREATE OR REPLACE FUNCTION public.touch_reading_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_reading_lists_updated_at
BEFORE UPDATE ON public.reading_lists
FOR EACH ROW EXECUTE FUNCTION public.touch_reading_lists_updated_at();