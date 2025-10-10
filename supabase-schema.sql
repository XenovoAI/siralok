-- =============================================
-- SIR CBSE Database Schema for Supabase
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    exam_type TEXT CHECK (exam_type IN ('JEE', 'NEET', 'BOTH')),
    class_year TEXT CHECK (class_year IN ('11th', '12th', '12th-pass')),
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'basic', 'pro', 'vip')),
    subscription_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_image TEXT,
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 2. TEST SERIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('JEE', 'NEET', 'BOTH')),
    subject TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    total_questions INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. QUESTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_series_id UUID NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    subject TEXT NOT NULL,
    topic TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. USER TEST ATTEMPTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_series_id UUID NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_minutes INTEGER NOT NULL,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::DECIMAL / total_questions::DECIMAL) * 100) STORED
);

-- =============================================
-- 5. STUDY MATERIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('pdf', 'video', 'notes', 'image')),
    subject TEXT NOT NULL,
    chapter TEXT,
    exam_type TEXT CHECK (exam_type IN ('JEE', 'NEET', 'BOTH')),
    is_premium BOOLEAN DEFAULT false,
    price INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    downloads_count INTEGER DEFAULT 0
);

-- =============================================
-- 6. PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    transaction_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    subscription_type TEXT CHECK (subscription_type IN ('basic', 'pro', 'vip')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. SUBSCRIPTION PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    price INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, duration_days, features) VALUES
('basic', 299, 30, '["Access to 50+ tests", "Basic study materials", "Performance analytics", "Email support"]'),
('pro', 599, 30, '["Access to 200+ tests", "All study materials", "Advanced analytics", "Priority support", "Video lectures"]'),
('vip', 999, 30, '["Unlimited tests", "Premium study materials", "AI-powered insights", "24/7 dedicated support", "Live doubt sessions", "Personalized study plans"]')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- INDEXES for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_test_series_exam_type ON test_series(exam_type);
CREATE INDEX IF NOT EXISTS idx_questions_test_series ON questions(test_series_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_user ON user_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_test ON user_test_attempts(test_series_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON study_materials(subject);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Test series policies (public read)
CREATE POLICY "Anyone can view test series" ON test_series
    FOR SELECT USING (true);

-- Questions policies (public read for test takers)
CREATE POLICY "Anyone can view questions" ON questions
    FOR SELECT USING (true);

-- User test attempts policies (own data only)
CREATE POLICY "Users can view their own test attempts" ON user_test_attempts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own test attempts" ON user_test_attempts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Study materials policies (public read with premium check)
CREATE POLICY "Anyone can view study materials" ON study_materials
    FOR SELECT USING (true);

-- Payments policies (own data only)
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
    FOR SELECT USING (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_test_series_updated_at BEFORE UPDATE ON test_series
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- Insert sample test series
INSERT INTO test_series (title, description, exam_type, subject, difficulty_level, total_questions, duration_minutes, price, is_free) VALUES
('JEE Physics Mock Test 1', 'Complete physics test covering mechanics and thermodynamics', 'JEE', 'Physics', 'medium', 30, 60, 0, true),
('NEET Biology Chapter Test', 'Test on human physiology and genetics', 'NEET', 'Biology', 'easy', 25, 45, 0, true),
('JEE Mathematics Advanced', 'Advanced calculus and algebra problems', 'JEE', 'Mathematics', 'hard', 40, 90, 99, false),
('NEET Chemistry Organic', 'Organic chemistry reactions and mechanisms', 'NEET', 'Chemistry', 'medium', 30, 60, 49, false)
ON CONFLICT DO NOTHING;

-- Note: Questions would be inserted separately with actual content
-- Study materials would also be added through the admin panel

COMMENT ON TABLE users IS 'Stores user account information and subscription details';
COMMENT ON TABLE test_series IS 'Contains all test series available on the platform';
COMMENT ON TABLE questions IS 'Stores individual questions for each test series';
COMMENT ON TABLE user_test_attempts IS 'Records user test attempts and scores';
COMMENT ON TABLE study_materials IS 'Stores study materials like PDFs, videos, notes';
COMMENT ON TABLE payments IS 'Tracks all payment transactions';
COMMENT ON TABLE subscription_plans IS 'Defines available subscription plans';
