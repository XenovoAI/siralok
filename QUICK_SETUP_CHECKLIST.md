# ⚡ Quick Setup Checklist

Use this as a quick reference while setting up. For detailed instructions, see `COMPLETE_SETUP_GUIDE.md`.

---

## 🎯 Phase 1: Supabase Setup (15 minutes)

### 1.1 Create Project
- [ ] Go to https://supabase.com
- [ ] Create new project: "SIR-CBSE"
- [ ] Wait for project creation (2-3 min)

### 1.2 Get Credentials
- [ ] Go to Settings → API
- [ ] Copy **Project URL**
- [ ] Copy **anon key**
- [ ] Update `/app/.env` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

### 1.3 Create Storage Buckets
- [ ] Go to Storage
- [ ] Create bucket: `materials-pdfs` (Public ✓)
- [ ] Create bucket: `materials-thumbnails` (Public ✓)

### 1.4 Setup Storage Policies
For **each bucket** (materials-pdfs, materials-thumbnails):

**Policy 1 - Allow Uploads:**
```sql
bucket_id = 'materials-pdfs' AND auth.role() = 'authenticated'
```

**Policy 2 - Allow Public Read:**
```sql
bucket_id = 'materials-pdfs'
```

### 1.5 Create Database Tables
- [ ] Go to SQL Editor → New Query
- [ ] Copy SQL from `COMPLETE_SETUP_GUIDE.md` (Step 2.5)
- [ ] Run the SQL query
- [ ] Verify tables created: `materials`, `material_downloads`

### 1.6 Configure Authentication
- [ ] Go to Authentication → Providers
- [ ] Enable **Email** provider
- [ ] Go to Settings → Auth Settings
- [ ] **Disable** email confirmations (for testing)
- [ ] Save

---

## 💳 Phase 2: Razorpay Setup (10 minutes)

### 2.1 Create Account
- [ ] Go to https://razorpay.com
- [ ] Sign up for account
- [ ] Toggle to **Test Mode** (top-left)

### 2.2 Get API Keys
- [ ] Go to Settings → API Keys
- [ ] Click "Generate Test Keys"
- [ ] Copy **Key ID** (rzp_test_xxx)
- [ ] Copy **Key Secret**

### 2.3 Update Environment
- [ ] Update `/app/.env`:
```bash
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### 2.4 Restart Server
```bash
sudo supervisorctl restart nextjs
```
- [ ] Wait 10 seconds
- [ ] Verify: `sudo supervisorctl status nextjs` shows RUNNING

---

## 👤 Phase 3: Create Admin (5 minutes)

### 3.1 Via Supabase Dashboard
- [ ] Go to Authentication → Users
- [ ] Click "Add User"
- [ ] Email: `admin@sircbse.com`
- [ ] Password: `admin123`
- [ ] Auto Confirm: **Yes** ✓
- [ ] Click "Create User"

### 3.2 Set Admin Role
- [ ] Click on the created user
- [ ] Scroll to "Raw User Meta Data"
- [ ] Click "Edit"
- [ ] Add JSON:
```json
{
  "name": "Admin User",
  "role": "admin"
}
```
- [ ] Click "Save"

### 3.3 Verify Access
- [ ] Open your site
- [ ] Login with `admin@sircbse.com` / `admin123`
- [ ] Check navbar shows "Admin Panel" link
- [ ] Click it - should open admin page

---

## 📚 Phase 4: Add Materials (10 minutes)

### 4.1 Add Free Material
- [ ] Login as admin
- [ ] Go to Admin Panel
- [ ] Click "Add Material"
- [ ] Fill form:
  - Title: "Physics - Motion"
  - Subject: Physics
  - Class: Class 11
  - Free Toggle: **ON** (green)
  - Upload PDF and thumbnail
- [ ] Click "Add Material"

### 4.2 Add Paid Material
- [ ] Click "Add Material" again
- [ ] Fill form:
  - Title: "Chemistry Full Course"
  - Subject: Chemistry
  - Class: Class 12
  - Free Toggle: **OFF** (gray)
  - Price: 199
  - Upload PDF and thumbnail
- [ ] Click "Add Material"

---

## 🧪 Phase 5: Testing (10 minutes)

### 5.1 Test Free Material
- [ ] Logout from admin
- [ ] Go to Materials page
- [ ] See free material with "FREE" badge
- [ ] Register new user: `test@example.com` / `test123`
- [ ] Click Download on free material
- [ ] PDF downloads immediately ✅

### 5.2 Test Paid Material
- [ ] Still as test user
- [ ] See paid material with "₹199" badge
- [ ] Click "Buy for ₹199"
- [ ] Razorpay modal opens ✅
- [ ] Use test card:
  - Card: `4111 1111 1111 1111`
  - Expiry: `12/25`
  - CVV: `123`
- [ ] Complete payment
- [ ] See success message
- [ ] Download button appears
- [ ] Click Download - PDF downloads ✅

### 5.3 Test Admin Panel
- [ ] Login as admin
- [ ] Go to Admin Panel
- [ ] Check stats show correct numbers
- [ ] Try editing a material
- [ ] Everything works ✅

---

## ✅ Final Verification

Run these commands:

```bash
# Check services
sudo supervisorctl status

# Should show:
# mongodb    RUNNING ✅
# nextjs     RUNNING ✅
# nginx      RUNNING ✅

# Check logs (no errors)
tail -n 50 /var/log/supervisor/nextjs.out.log
```

### Checklist:
- [ ] MongoDB running
- [ ] Next.js running
- [ ] Supabase configured
- [ ] Razorpay configured
- [ ] Admin account working
- [ ] Free materials working
- [ ] Paid materials working
- [ ] Payment gateway working
- [ ] Mobile responsive

---

## 🎉 You're Done!

**Setup Time:** ~50 minutes

**What You Have Now:**
- ✅ Full JEE/NEET preparation platform
- ✅ Free & paid materials system
- ✅ Razorpay payment integration
- ✅ Admin panel for management
- ✅ User authentication
- ✅ Download tracking
- ✅ Mobile responsive

**Next Steps:**
1. Add more study materials
2. Customize branding/colors if needed
3. Test on multiple devices
4. When ready for production:
   - Switch Razorpay to Live Mode
   - Enable email confirmations
   - Update domain settings

---

## 🆘 Quick Troubleshooting

**Materials not showing?**
```bash
# Check Supabase connection
# Verify NEXT_PUBLIC_SUPABASE_URL in .env
# Restart: sudo supervisorctl restart nextjs
```

**Payment not working?**
```bash
# Check Razorpay keys in .env
# Verify using Test Mode keys (rzp_test_xxx)
# Restart: sudo supervisorctl restart nextjs
```

**Can't access admin panel?**
```bash
# Check user metadata in Supabase has "role": "admin"
# Logout and login again
```

**Upload failed?**
```bash
# Verify storage buckets are Public
# Check RLS policies created for both buckets
```

---

## 📖 Full Documentation

- **Complete Setup Guide**: `COMPLETE_SETUP_GUIDE.md`
- **Free vs Paid Materials**: `FREE_VS_PAID_MATERIALS_SEPARATION.md`
- **Testing Results**: `test_result.md`

---

**Need help?** Check the logs and error messages, then refer to the troubleshooting section in `COMPLETE_SETUP_GUIDE.md`.
