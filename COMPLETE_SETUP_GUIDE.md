# 🚀 Complete Setup Guide - SIR CBSE Platform

This guide will walk you through setting up the entire SIR CBSE platform from scratch.

---

## 📋 Overview

The platform consists of:
1. **Frontend**: Next.js 14 (running on port 3000)
2. **Backend API**: Next.js API routes (MongoDB + Razorpay)
3. **Database**: MongoDB (already running)
4. **Storage & Auth**: Supabase (needs setup)
5. **Payment**: Razorpay (needs API keys)

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:
- [ ] Supabase account (free tier works)
- [ ] Razorpay account (test mode or live mode)
- [ ] Internet connection for initial setup

---

## 🗄️ Step 1: MongoDB Setup

### Status: ✅ Already Running

MongoDB is already configured and running. Verify with:
```bash
sudo supervisorctl status mongodb
```

**Environment Variables (Already Set):**
```
MONGO_URL=mongodb://mongo:27017/sircbse
DB_NAME=sircbse_db
```

**Collections Created Automatically:**
- `users` - User accounts
- `materials` - Study materials (from Supabase)
- `payment_orders` - Razorpay orders
- `purchases` - Completed purchases

No action needed! ✅

---

## 🔐 Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. **Go to**: https://supabase.com
2. **Sign up/Login** with your account
3. **Create New Project**:
   - Name: `SIR-CBSE` (or any name)
   - Database Password: Choose a strong password
   - Region: Choose closest to you
   - Wait 2-3 minutes for project creation

### 2.2 Get Supabase Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Update `.env` file** with your credentials:
```bash
# Open the .env file
nano /app/.env

# Update these lines with YOUR values:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

### 2.3 Setup Supabase Storage Buckets

**Go to Storage → Create Buckets:**

1. **Create Bucket: `materials-pdfs`**
   - Name: `materials-pdfs`
   - Public: **Yes** (check the box)
   - Click Create

2. **Create Bucket: `materials-thumbnails`**
   - Name: `materials-thumbnails`
   - Public: **Yes** (check the box)
   - Click Create

### 2.4 Setup Row-Level Security (RLS) Policies

**For `materials-pdfs` bucket:**

Go to **Storage** → **materials-pdfs** → **Policies** → **New Policy**

**Policy 1: Allow Uploads (Authenticated Users)**
```sql
-- Policy Name: Allow authenticated uploads
-- Target: INSERT
-- WITH CHECK expression:
bucket_id = 'materials-pdfs' AND auth.role() = 'authenticated'
```

**Policy 2: Allow Public Read**
```sql
-- Policy Name: Allow public read
-- Target: SELECT
-- USING expression:
bucket_id = 'materials-pdfs'
```

**For `materials-thumbnails` bucket:**

Repeat the same 2 policies for `materials-thumbnails`:
- Replace `materials-pdfs` with `materials-thumbnails`

### 2.5 Setup Database Tables

**Go to SQL Editor → New Query**

**Run this SQL to create tables:**

```sql
-- 1. Materials table
CREATE TABLE IF NOT EXISTS public.materials (
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

-- 2. Material downloads tracking table
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

-- 3. Enable Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_downloads ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for materials
CREATE POLICY "Allow public read materials" ON public.materials
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert materials" ON public.materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update materials" ON public.materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete materials" ON public.materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. RLS Policies for material_downloads
CREATE POLICY "Allow authenticated insert downloads" ON public.material_downloads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to see their own downloads" ON public.material_downloads
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_materials_subject ON public.materials(subject);
CREATE INDEX IF NOT EXISTS idx_materials_class ON public.materials(class);
CREATE INDEX IF NOT EXISTS idx_materials_is_free ON public.materials(is_free);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.material_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_material_id ON public.material_downloads(material_id);
```

Click **Run** to execute.

### 2.6 Setup Authentication

**Go to Authentication → Settings**

1. **Enable Email Provider**:
   - Go to **Providers** → **Email** → Toggle **Enable**

2. **Disable Email Confirmations** (for easier testing):
   - Go to **Settings** → **Auth Settings**
   - Scroll to **Email** section
   - Uncheck **"Enable email confirmations"**
   - Click **Save**

3. **Site URL Configuration**:
   - Go to **Settings** → **Auth Settings**
   - Set **Site URL**: Copy from your `.env` file `NEXT_PUBLIC_BASE_URL`
   - Click **Save**

---

## 💳 Step 3: Razorpay Setup

### 3.1 Create Razorpay Account

1. **Go to**: https://razorpay.com
2. **Sign up** for a new account
3. **Complete KYC** (if you want to go live)
4. For testing, you can use **Test Mode**

### 3.2 Get API Keys

**Test Mode (Recommended for Setup):**

1. Login to Razorpay Dashboard
2. Toggle **Test Mode** (top-left corner)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Keys**
5. Copy:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxx`

**Live Mode (For Production):**

1. Toggle to **Live Mode**
2. Complete KYC verification
3. Go to **Settings** → **API Keys**
4. Click **Generate Live Keys**
5. Copy both keys

### 3.3 Update Environment Variables

```bash
# Open .env file
nano /app/.env

# Update these lines with YOUR Razorpay keys:
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID           # or rzp_live_xxx for live
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

**Save the file**: `Ctrl+X` → `Y` → `Enter`

### 3.4 Restart the Application

After updating `.env`, restart the server:
```bash
sudo supervisorctl restart nextjs
```

Wait 10 seconds, then verify:
```bash
sudo supervisorctl status nextjs
```

Should show: `RUNNING`

---

## 👤 Step 4: Create Admin Account

### 4.1 Register Admin via Supabase

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Fill in:
   - Email: `admin@sircbse.com`
   - Password: `admin123` (or your choice)
   - Auto Confirm User: **Yes** (check the box)
4. Click **Create User**
5. **Important**: After user is created, click on the user
6. Scroll to **Raw User Meta Data**
7. Click **Edit** and add:
```json
{
  "name": "Admin User",
  "role": "admin"
}
```
8. Click **Save**

**Option B: Using Registration Page**

1. Open your site: `https://YOUR-DOMAIN.rpa.cloudlabs.emergentmethods.ai`
2. Click **Register** / **Get Started**
3. Fill in:
   - Name: `Admin User`
   - Email: `admin@sircbse.com`
   - Password: `admin123`
4. Register
5. Go to Supabase Dashboard → Authentication → Users
6. Find the user and update `user_metadata` to add `"role": "admin"`

### 4.2 Verify Admin Access

1. Login to your site with admin credentials
2. You should see **"Admin Panel"** link in the navbar
3. Click it to access `/admin` page

---

## 📚 Step 5: Add Test Materials

### 5.1 Login as Admin

1. Go to your site
2. Login with admin credentials
3. Click **Admin Panel** in navbar

### 5.2 Add Free Material

1. Click **Add Material** button
2. Fill in form:
   - **Title**: "Physics Chapter 1 - Motion"
   - **Description**: "Comprehensive notes on laws of motion"
   - **Subject**: Physics
   - **Class**: Class 11
   - **Free Material Toggle**: **ON** (green)
   - **PDF File**: Upload any test PDF
   - **Thumbnail**: Upload any test image
3. Click **Add Material**

### 5.3 Add Paid Material

1. Click **Add Material** button again
2. Fill in form:
   - **Title**: "Chemistry Full Course"
   - **Description**: "Complete chemistry course with examples"
   - **Subject**: Chemistry
   - **Class**: Class 12
   - **Free Material Toggle**: **OFF** (gray)
   - **Price**: 199 (₹199)
   - **PDF File**: Upload any test PDF
   - **Thumbnail**: Upload any test image
3. Click **Add Material**

---

## 🧪 Step 6: Test the System

### 6.1 Test Free Materials

1. **Logout** from admin account
2. Go to **Materials** page
3. You should see your free material with **FREE** badge
4. Try to download (should prompt for login)
5. **Register a new user**:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
6. After login, click **Download** on free material
7. PDF should download immediately ✅

### 6.2 Test Paid Materials

1. Still logged in as test user
2. Go to **Materials** page
3. You should see paid material with **₹199** badge
4. Click **Buy for ₹199**
5. Razorpay payment modal should open ✅

**Test Payment (Test Mode):**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- OTP: `123456` (if prompted)

6. Complete payment
7. You should see: "Payment successful!"
8. Material card should now show **Download** button
9. Click download - PDF should download ✅

### 6.3 Test Admin Panel

1. **Login as admin** (`admin@sircbse.com`)
2. Go to **Admin Panel**
3. Verify you can see:
   - Total Users count (should be 2+)
   - Total Materials (should be 2+)
   - Total Downloads count
4. Try editing a material
5. Try deleting a material (optional)

---

## 🔧 Step 7: Verify Services

Run these commands to ensure everything is running:

```bash
# Check all services
sudo supervisorctl status

# Should show:
# mongodb    RUNNING
# nextjs     RUNNING
# nginx      RUNNING

# Check Next.js logs
tail -n 50 /var/log/supervisor/nextjs.out.log

# Check MongoDB logs (if needed)
tail -n 50 /var/log/supervisor/mongodb.out.log
```

---

## 📱 Step 8: Test on Mobile

1. Open your site URL on mobile browser
2. Test responsive design:
   - Navigation menu (hamburger)
   - Material cards layout
   - Admin panel (if admin)
   - Payment flow
3. Verify all features work on mobile ✅

---

## 🎯 Quick Verification Checklist

- [ ] MongoDB running (`sudo supervisorctl status mongodb`)
- [ ] Next.js running (`sudo supervisorctl status nextjs`)
- [ ] Supabase project created
- [ ] Supabase storage buckets created (`materials-pdfs`, `materials-thumbnails`)
- [ ] Supabase RLS policies configured
- [ ] Supabase tables created (`materials`, `material_downloads`)
- [ ] Razorpay account created
- [ ] Razorpay API keys added to `.env`
- [ ] Admin account created in Supabase
- [ ] Admin can access `/admin` page
- [ ] Free material added and downloadable
- [ ] Paid material added and purchasable
- [ ] Payment gateway working (test mode)
- [ ] Mobile responsive design working

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env`
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`
- Restart Next.js: `sudo supervisorctl restart nextjs`

### Issue: "Storage upload failed"
**Solution:**
- Check if storage buckets are **Public**
- Verify RLS policies are created for both buckets
- Check if user is authenticated

### Issue: "Payment not working"
**Solution:**
- Verify Razorpay keys in `.env`
- Make sure you're using Test Mode keys (starts with `rzp_test_`)
- Restart Next.js after updating keys
- Check browser console for errors

### Issue: "Admin panel not accessible"
**Solution:**
- Verify user metadata in Supabase has `"role": "admin"`
- Logout and login again
- Check browser console for errors

### Issue: "Materials not showing"
**Solution:**
- Go to Supabase → Storage → Check if files uploaded
- Go to Supabase → Table Editor → Check `materials` table
- Check if RLS policies allow public read

### Issue: "Downloads not counting"
**Solution:**
- Check if `material_downloads` table exists
- Verify RLS policies on the table
- Check browser console for errors

---

## 🚀 Going Live

### Before Going Live:

1. **Razorpay**:
   - Complete KYC verification
   - Switch to Live Mode keys
   - Update `.env` with live keys

2. **Supabase**:
   - Enable email confirmations
   - Configure production domain
   - Review RLS policies

3. **Testing**:
   - Test entire user journey end-to-end
   - Test payment with real card (small amount)
   - Test on multiple devices

4. **Security**:
   - Change `JWT_SECRET` to a strong random value
   - Review all environment variables
   - Enable HTTPS (already enabled on Emergent)

---

## 📞 Need Help?

If you encounter any issues:

1. Check logs: `tail -n 100 /var/log/supervisor/nextjs.err.log`
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all services are running
5. Ask for help with specific error messages

---

## ✅ Setup Complete!

Once all steps are done, your SIR CBSE platform is ready to use with:
- ✅ User authentication
- ✅ Free materials (simple download)
- ✅ Paid materials (Razorpay integration)
- ✅ Admin panel (material management)
- ✅ Download tracking
- ✅ Mobile responsive design

**Happy Teaching! 📚**
