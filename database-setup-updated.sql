-- ============================================
-- COMPLETE DATABASE SETUP FOR SIR CBSE
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CREATE PAYMENTS TABLE (MISSING)
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    transaction_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    subscription_type TEXT CHECK (subscription_type IN ('basic', 'pro', 'vip', 'material_purchase')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE MATERIALS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    class TEXT,
    pdf_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT true,
    price INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREATE MATERIAL DOWNLOADS TABLE
-- ============================================
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

-- ============================================
-- 4. CREATE PURCHASES TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    payment_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public read materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated insert materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated update materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated delete materials" ON public.materials;
DROP POLICY IF EXISTS "Allow authenticated insert downloads" ON public.material_downloads;
DROP POLICY IF EXISTS "Allow users to see downloads" ON public.material_downloads;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON public.purchases;

-- ============================================
-- 7. CREATE RLS POLICIES
-- ============================================

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Materials policies
CREATE POLICY "Allow public read materials" ON public.materials
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert materials" ON public.materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update materials" ON public.materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete materials" ON public.materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- Material downloads policies
CREATE POLICY "Allow authenticated insert downloads" ON public.material_downloads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to see downloads" ON public.material_downloads
    FOR SELECT USING (true);

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own purchases" ON public.purchases
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- ============================================
-- 8. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_materials_subject ON public.materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_class ON public.materials(class);
CREATE INDEX IF NOT EXISTS idx_materials_is_free ON public.materials(is_free);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON public.materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.material_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_material_id ON public.material_downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_material ON public.purchases(material_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- ============================================
-- 9. UPDATE EXISTING DATA
-- ============================================
UPDATE public.materials SET is_free = true WHERE is_free IS NULL;
UPDATE public.materials SET price = 0 WHERE price IS NULL;

-- ============================================
-- 10. FUNCTION FOR UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 11. CREATE TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_materials_updated_at ON public.materials;
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON public.purchases;
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database setup complete! All tables and policies created.' as status;
