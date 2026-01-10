-- Create a separate protected table for seller contact information
CREATE TABLE public.listing_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.user_listings(id) ON DELETE CASCADE,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(listing_id)
);

-- Enable RLS on the new table
ALTER TABLE public.listing_contacts ENABLE ROW LEVEL SECURITY;

-- Only listing owners and admins can view contact info
CREATE POLICY "Owners can view their listing contacts"
ON public.listing_contacts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_listings ul 
    WHERE ul.id = listing_id AND ul.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Only listing owners can insert/update their contact info
CREATE POLICY "Owners can insert their listing contacts"
ON public.listing_contacts
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_listings ul 
    WHERE ul.id = listing_id AND ul.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can update their listing contacts"
ON public.listing_contacts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_listings ul 
    WHERE ul.id = listing_id AND ul.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete their listing contacts"
ON public.listing_contacts
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_listings ul 
    WHERE ul.id = listing_id AND ul.user_id = auth.uid()
  )
);

-- Admins can manage all contacts
CREATE POLICY "Admins can manage all contacts"
ON public.listing_contacts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing contact data to the new table
INSERT INTO public.listing_contacts (listing_id, contact_email, contact_phone)
SELECT id, contact_email, contact_phone 
FROM public.user_listings 
WHERE contact_email IS NOT NULL AND contact_phone IS NOT NULL;

-- Now remove the contact columns from user_listings
ALTER TABLE public.user_listings DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.user_listings DROP COLUMN IF EXISTS contact_phone;