-- Create storage bucket for crazy recipe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crazy-recipe-images',
  'crazy-recipe-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the bucket
CREATE POLICY "Users can upload their own recipe images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'crazy-recipe-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view recipe images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'crazy-recipe-images'
);

CREATE POLICY "Users can update their own recipe images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'crazy-recipe-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own recipe images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'crazy-recipe-images' AND
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
