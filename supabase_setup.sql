-- ============================================
-- Supabase Database Setup for SIR CBSE
-- ============================================

-- 1. Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS public.material_downloads CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;

-- 2. Create materials table with ALL required columns
CREATE TABLE public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    class TEXT,
    pdf_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    price INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create material downloads tracking table
CREATE TABLE public.material_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    material_title TEXT NOT NULL,
    material_type TEXT NOT NULL DEFAULT 'free',
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, material_id)
);

-- 4. Enable Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for materials (allow public read, authenticated write)
CREATE POLICY "Allow public read materials" ON public.materials
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert materials" ON public.materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update materials" ON public.materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete materials" ON public.materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. RLS Policies for material_downloads
CREATE POLICY "Allow authenticated insert downloads" ON public.material_downloads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to see downloads" ON public.material_downloads
    FOR SELECT USING (true);

-- 7. Create indexes for better performance
CREATE INDEX idx_materials_subject ON public.materials(subject);
CREATE INDEX idx_materials_class ON public.materials(class);
CREATE INDEX idx_materials_is_free ON public.materials(is_free);
CREATE INDEX idx_materials_created_at ON public.materials(created_at DESC);
CREATE INDEX idx_downloads_user_id ON public.material_downloads(user_id);
CREATE INDEX idx_downloads_material_id ON public.material_downloads(material_id);
CREATE INDEX idx_downloads_downloaded_at ON public.material_downloads(downloaded_at DESC);

-- 8. Grant permissions
GRANT ALL ON public.materials TO authenticated;
GRANT ALL ON public.material_downloads TO authenticated;
GRANT SELECT ON public.materials TO anon;
GRANT SELECT ON public.material_downloads TO anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Tables created successfully!';
    RAISE NOTICE 'Materials table with columns: id, title, description, subject, class, pdf_url, thumbnail_url, downloads, is_free, price, created_at, updated_at';
    RAISE NOTICE 'Material_downloads table created for tracking';
END $$;
