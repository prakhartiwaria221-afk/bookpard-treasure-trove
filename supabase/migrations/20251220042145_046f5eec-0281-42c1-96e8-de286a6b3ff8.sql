-- Create storage bucket for user book images
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the bucket
CREATE POLICY "Anyone can view book images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'book-images');

CREATE POLICY "Authenticated users can upload book images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'book-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own book images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'book-images' AND auth.uid()::text = (storage.foldername(name))[1]);