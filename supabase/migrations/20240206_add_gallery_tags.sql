-- Add tags column (text array)
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create index for faster tag queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON gallery_images USING GIN (tags);

-- Update existing images to have 'gallery' tag by default
UPDATE gallery_images 
SET tags = ARRAY['gallery']
WHERE tags = '{}' OR tags IS NULL;

-- Add comment
COMMENT ON COLUMN gallery_images.tags IS 'Tags for categorizing images (carousel, gallery, featured, etc.)';
