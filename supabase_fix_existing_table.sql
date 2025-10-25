-- ============================================
-- Supabase Database Fix for SIR CBSE
-- This script ADDS missing columns to existing tables
-- ============================================

-- 1. Add missing columns to existing materials table
-- (This won't fail if columns already exist)

-- Add is_free column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='materials' AND column_name='is_free') THEN
        ALTER TABLE public.materials ADD COLUMN is_free BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_free column';
    ELSE
        RAISE NOTICE 'is_free column already exists';
    END IF;
END $$;

-- Add price column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='materials' AND column_name='price') THEN
        ALTER TABLE public.materials ADD COLUMN price INTEGER DEFAULT 0;
        RAISE NOTICE 'Added price column';
    ELSE
        RAISE NOTICE 'price column already exists';
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='materials' AND column_name='updated_at') THEN
        ALTER TABLE public.materials ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- 2. Create material_downloads table if it doesn't exist
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

-- 3. Enable Row Level Security (safe to run multiple times)
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated insert materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated update materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated delete materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated insert downloads" ON public.material_downloads;
DROP POLICY IF EXISTS "Allow users to see downloads" ON public.material_downloads;

-- 5. Create RLS Policies for materials
CREATE POLICY "Allow public read materials" ON public.materials
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert materials" ON public.materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update materials" ON public.materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete materials" ON public.materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Create RLS Policies for material_downloads
CREATE POLICY "Allow authenticated insert downloads" ON public.material_downloads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to see downloads" ON public.material_downloads
    FOR SELECT USING (true);

-- 7. Create indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_materials_subject ON public.materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_class ON public.materials(class);
CREATE INDEX IF NOT EXISTS idx_materials_is_free ON public.materials(is_free);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON public.materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.material_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_material_id ON public.material_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON public.material_downloads(downloaded_at DESC);

-- 8. Update existing materials to be free by default (if any exist)
UPDATE public.materials SET is_free = true WHERE is_free IS NULL;
UPDATE public.materials SET price = 0 WHERE price IS NULL;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '✅ Materials table updated with is_free and price columns';
    RAISE NOTICE '✅ Material_downloads table created';
    RAISE NOTICE '✅ RLS policies configured';
    RAISE NOTICE '✅ Indexes created';
END $$;
