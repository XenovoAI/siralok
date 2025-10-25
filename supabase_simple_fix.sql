-- Add missing columns to materials table
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT true;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create material_downloads table
CREATE TABLE IF NOT EXISTS public.material_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    material_title TEXT NOT NULL,
    material_type TEXT NOT NULL DEFAULT 'free',
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, material_id)
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

-- Update existing materials
UPDATE public.materials SET is_free = true WHERE is_free IS NULL;
UPDATE public.materials SET price = 0 WHERE price IS NULL;
