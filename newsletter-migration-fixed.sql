-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE MIGRATION (FIXED)
-- Run this in Supabase SQL Editor to add newsletter functionality
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================
DROP POLICY IF EXISTS "Allow public insert newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated read newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public select newsletter subscribers" ON public.newsletter_subscribers;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================
-- Allow anyone to subscribe (public insert)
CREATE POLICY "Allow public insert newsletter subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read subscribers (for admin)
CREATE POLICY "Allow authenticated read newsletter subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow public to check if email exists (for duplicate prevention)
CREATE POLICY "Allow public select newsletter subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (true);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_verified ON public.newsletter_subscribers(verified);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Newsletter subscribers table created successfully!' as status;
