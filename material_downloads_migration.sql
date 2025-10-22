-- =============================================
-- Material Downloads Tracking Table
-- =============================================
-- This table tracks user downloads to ensure each user is counted only once per material

CREATE TABLE IF NOT EXISTS material_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    material_id UUID NOT NULL,
    material_title TEXT NOT NULL,
    material_type TEXT DEFAULT 'free' CHECK (material_type IN ('free', 'paid')),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one download record per user per material
    UNIQUE(user_id, material_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_material_downloads_user ON material_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_material_downloads_material ON material_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_material_downloads_downloaded_at ON material_downloads(downloaded_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE material_downloads ENABLE ROW LEVEL SECURITY;

-- Users can view their own download history
CREATE POLICY "Users can view their own downloads" ON material_downloads
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can create their own download records
CREATE POLICY "Users can insert their own downloads" ON material_downloads
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Add comment
COMMENT ON TABLE material_downloads IS 'Tracks material downloads - one record per user per material';
