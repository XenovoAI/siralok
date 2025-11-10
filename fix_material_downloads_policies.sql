-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own downloads" ON material_downloads;
DROP POLICY IF EXISTS "Users can insert their own downloads" ON material_downloads;

-- Recreate policies with proper syntax
CREATE POLICY "Users can view their own downloads" ON material_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads" ON material_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);
