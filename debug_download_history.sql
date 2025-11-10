-- Debug download history - check if data exists
SELECT
    COUNT(*) as total_downloads,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT material_id) as unique_materials
FROM material_downloads;

-- Check recent downloads (last 24 hours)
SELECT
    md.*,
    m.title as material_title,
    m.subject,
    m.class,
    m.is_free
FROM material_downloads md
LEFT JOIN materials m ON md.material_id = m.id
WHERE md.downloaded_at >= NOW() - INTERVAL '24 hours'
ORDER BY md.downloaded_at DESC
LIMIT 10;

-- Check if RLS is working - try to select as authenticated user
-- (This would need to be run with proper auth context)

-- Check table permissions
SELECT
    schemaname,
    tablename,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE tablename = 'material_downloads';

-- Check policies
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
