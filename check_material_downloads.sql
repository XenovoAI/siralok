-- Check if material_downloads table exists and its structure
SELECT
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_name = 'material_downloads' AND table_schema = 'public';

-- Check existing policies on material_downloads table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'material_downloads';

-- Check table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'material_downloads' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'material_downloads' AND schemaname = 'public';
