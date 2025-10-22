# Download Management System - Setup Guide

## Overview
A complete download management system has been implemented for SIRCBSE that requires users to login before downloading any study materials. The system tracks downloads and ensures each user is counted only once per material.

---

## 🎯 Features Implemented

### 1. **Authentication Enforcement**
- ✅ Users MUST login/signup before downloading ANY material
- ✅ Unauthenticated users are redirected to login page with return URL
- ✅ After successful login/signup → Auto-redirect back to materials page
- ✅ Lock icon displayed on buttons when not logged in

### 2. **Download Tracking**
- ✅ Each download is tracked in Supabase `material_downloads` table
- ✅ One download count per user per material (unique constraint)
- ✅ Subsequent downloads by same user don't increment counter
- ✅ Toast notification shows "already counted" for repeat downloads

### 3. **Smart Redirect Flow**
- ✅ Materials page → Click download (not logged in) → Login page
- ✅ Login page → Enter credentials → Auto-redirect to materials page
- ✅ Register page → Create account → Auto-redirect to materials page
- ✅ Works with both "View" and "Download" buttons

---

## 📋 Setup Instructions

### Step 1: Create Download Tracking Table in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Create a new query
4. Copy and paste the contents of `/app/material_downloads_migration.sql`
5. Click **Run** to execute the migration

**What this creates:**
- `material_downloads` table with proper schema
- Indexes for fast lookups
- Row Level Security (RLS) policies
- Unique constraint (user_id + material_id)

### Step 2: Verify Table Creation

Run this query in Supabase SQL Editor:
```sql
SELECT * FROM material_downloads LIMIT 1;
```

You should see the table structure (empty initially).

### Step 3: Test the Flow

1. **Test as unauthenticated user:**
   - Go to `/materials` page
   - Try clicking "Download" on any material
   - Should redirect to `/login?returnUrl=/materials`

2. **Test signup flow:**
   - Create a new account
   - Should auto-redirect back to `/materials`
   - Click "Download" on a material
   - Should download successfully and show success toast

3. **Test download tracking:**
   - Download the same material again
   - Should show "Download started! (already counted)"
   - Check Supabase dashboard - only 1 record in `material_downloads` for that user+material

---

## 🗂️ Database Schema

### `material_downloads` Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | User who downloaded (from Supabase Auth) |
| `user_email` | TEXT | User's email for tracking |
| `material_id` | UUID | ID of downloaded material |
| `material_title` | TEXT | Title of material for reference |
| `material_type` | TEXT | 'free' or 'paid' (for future use) |
| `downloaded_at` | TIMESTAMP | When download occurred |

**Unique Constraint:** `(user_id, material_id)` - Ensures one download per user per material

---

## 🔒 Security Features

### Row Level Security (RLS) Policies

1. **SELECT Policy:** Users can only view their own download history
   ```sql
   CREATE POLICY "Users can view their own downloads" ON material_downloads
       FOR SELECT USING (auth.uid()::text = user_id::text);
   ```

2. **INSERT Policy:** Users can only create download records for themselves
   ```sql
   CREATE POLICY "Users can insert their own downloads" ON material_downloads
       FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
   ```

This prevents users from:
- Viewing others' download history
- Creating fake download records for other users
- Manipulating download counts

---

## 📝 Files Modified

### Frontend Files:
1. **`/app/app/materials/page.js`**
   - Added authentication check in `handleDownload()`
   - Added authentication check in `handleView()`
   - Implemented download tracking in Supabase
   - Added lock icons when not logged in
   - Redirect to login with returnUrl

2. **`/app/app/login/page.js`**
   - Added `returnUrl` query parameter support
   - Auto-redirect after successful login
   - Pass returnUrl to register link

3. **`/app/app/register/page.js`**
   - Added `returnUrl` query parameter support
   - Auto-redirect after successful signup
   - Handle both email confirmation and instant login

### Backend Files:
4. **`/app/app/api/[[...path]]/route.js`**
   - Added MongoDB API endpoints for download tracking (optional/backup)
   - Not actively used (Supabase is primary)

### Migration Files:
5. **`/app/material_downloads_migration.sql`**
   - Supabase table schema
   - RLS policies
   - Indexes

---

## 🧪 Testing Checklist

### Manual Testing Steps:

- [ ] **Unauthenticated User Flow**
  - Visit `/materials` without login
  - Click "Download" button → Should redirect to login
  - Click "View" button → Should redirect to login
  - See lock icons on buttons

- [ ] **Login Flow**
  - Login from materials redirect
  - Should return to `/materials` after login
  - Download should work after login

- [ ] **Signup Flow**
  - Click "Register" link from login page
  - Should preserve returnUrl in register link
  - Should redirect to materials after signup

- [ ] **Download Tracking**
  - Download a material (first time)
  - Check Supabase: 1 record in `material_downloads`
  - Download count on material should increment by 1
  - Download same material again
  - Toast should say "already counted"
  - Supabase: Still only 1 record
  - Material download count: No change

- [ ] **Multiple Materials**
  - Download 3 different materials
  - Check Supabase: 3 records (one per material)
  - Each material's download count incremented

- [ ] **Multiple Users**
  - Logout and create new account
  - Download same material
  - Should create new download record
  - Material download count should increment

---

## 🚀 Future Enhancements (Ready for Implementation)

The system is designed to support paid materials in the future:

1. **Paid Materials Support:**
   - `material_type` field already exists ('free' or 'paid')
   - Can add subscription check before download
   - Can show "Upgrade" button for paid materials

2. **Download Analytics:**
   - Most downloaded materials
   - User download history page
   - Admin dashboard with download stats
   - Download trends over time

3. **Download Limits:**
   - Set daily/monthly download limits
   - Premium users get unlimited downloads
   - Free users limited to X downloads per month

---

## 📊 Query Examples

### Get User's Download History:
```sql
SELECT 
    material_title,
    downloaded_at
FROM material_downloads
WHERE user_id = 'USER_UUID'
ORDER BY downloaded_at DESC;
```

### Most Downloaded Materials:
```sql
SELECT 
    material_title,
    COUNT(*) as download_count
FROM material_downloads
GROUP BY material_id, material_title
ORDER BY download_count DESC
LIMIT 10;
```

### Download Count by Date:
```sql
SELECT 
    DATE(downloaded_at) as date,
    COUNT(*) as downloads
FROM material_downloads
GROUP BY DATE(downloaded_at)
ORDER BY date DESC;
```

---

## ⚠️ Important Notes

1. **Supabase Auth Required:** 
   - System uses Supabase authentication
   - User must be logged in via Supabase Auth
   - JWT token automatically handled by Supabase client

2. **Email Confirmation:**
   - If Supabase email confirmation is disabled (instant login) → Works immediately
   - If enabled → User must confirm email before downloading

3. **Materials Table:**
   - Must have `downloads` column (should already exist)
   - Downloads increment when new user downloads

4. **Browser Storage:**
   - Supabase auth state stored in localStorage
   - Session persists across page reloads

---

## 🐛 Troubleshooting

### Downloads Not Tracking?
- Check if `material_downloads` table exists
- Verify RLS policies are enabled
- Check browser console for errors

### Download Count Not Incrementing?
- Check if `materials` table has `downloads` column
- Verify Supabase update query is successful

### Redirect Not Working?
- Check if returnUrl is preserved in URL
- Verify useRouter and useSearchParams are working
- Check browser console for navigation errors

### User Not Logged In After Signup?
- Check Supabase dashboard: Authentication → Settings
- Verify "Enable email confirmations" setting
- If enabled, user must confirm email first

---

## ✅ Verification

After setup, you should see:

1. **In Supabase Dashboard:**
   - `material_downloads` table in Tables list
   - RLS enabled on the table
   - Policies created and active

2. **In Application:**
   - Login required message when trying to download
   - Redirect to login page with returnUrl
   - Auto-redirect after login
   - Download tracking working
   - Toast notifications showing correct messages

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify table and policies are created correctly
4. Test authentication flow step by step
