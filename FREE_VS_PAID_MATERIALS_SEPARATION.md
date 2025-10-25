# Free vs Paid Materials - Complete Separation Guide

## Overview
This document explains the complete separation between FREE and PAID materials in the SIR CBSE platform. Both material types are treated independently with their own logic flows.

---

## 🆓 FREE MATERIALS

### User Flow
1. **Browse Materials** → User can see FREE materials (green "FREE" badge)
2. **Click Download/View** → Authentication prompt appears (if not logged in)
3. **Login/Register** → User authenticates via modal
4. **Download Immediately** → No payment, no purchase checks
5. **Download Tracking** → System tracks downloads for analytics only

### Key Characteristics
- ✅ **No Payment Integration** - Completely independent of Razorpay
- ✅ **No Purchase Checks** - Only authentication required
- ✅ **Simple Flow** - Login → Download
- ✅ **Download Tracking** - Counts downloads per user (one-time count)
- ✅ **Supabase Only** - Uses Supabase for auth and download tracking

### Frontend Logic (`/app/app/materials/page.js`)
```javascript
// FREE MATERIALS PATH in handleDownload()
if (material.is_free) {
  // 1. Check if user already downloaded (for tracking)
  // 2. Create download record in Supabase (if new)
  // 3. Update download counter
  // 4. Trigger PDF download
  // NO payment checks, NO MongoDB, NO Razorpay
}
```

### Backend Logic (`/app/app/api/[[...path]]/route.js`)
- **Payment APIs reject free materials** (line 583-585)
- Free materials NEVER interact with payment endpoints
- No purchase records for free materials

---

## 💰 PAID MATERIALS

### User Flow
1. **Browse Materials** → User can see PAID materials (yellow "₹Price" badge)
2. **Click "Buy for ₹X"** → Authentication prompt appears (if not logged in)
3. **Login/Register** → User authenticates via modal
4. **Razorpay Payment** → Payment gateway opens
5. **Complete Payment** → Payment verified on backend
6. **Purchase Recorded** → Stored in MongoDB `purchases` collection
7. **Download/View Access** → User can now access the material

### Key Characteristics
- ✅ **Full Payment Integration** - Razorpay payment gateway
- ✅ **Purchase Validation** - Must purchase before download/view
- ✅ **MongoDB Storage** - Purchase records in MongoDB
- ✅ **Payment Verification** - HMAC SHA256 signature verification
- ✅ **One-time Payment** - Purchase once, download forever

### Frontend Logic (`/app/app/materials/page.js`)
```javascript
// PAID MATERIALS PATH in handleDownload()
if (!material.is_free) {
  // 1. Check if user purchased (MongoDB check)
  // 2. If not purchased → Show error "Please purchase"
  // 3. If purchased → Allow download
  // 4. Track download in Supabase (same as free)
}
```

### Backend Logic (`/app/app/api/[[...path]]/route.js`)

#### Payment Endpoints (PAID ONLY)
1. **POST /api/payment/create-order** (lines 567-646)
   - Creates Razorpay order
   - Rejects if material is free
   - Checks for duplicate purchases

2. **POST /api/payment/verify** (lines 649-707)
   - Verifies payment signature
   - Creates purchase record in MongoDB
   - Updates order status

3. **GET /api/payment/my-purchases** (lines 710-741)
   - Returns user's purchased materials
   - Includes material details

4. **GET /api/payment/check-purchase/:id** (lines 744-761)
   - Checks if user purchased specific material

---

## 🔐 Authentication (Both Types)

### Common Requirement
Both FREE and PAID materials require user authentication to:
- Prevent anonymous downloads
- Track download analytics
- Enforce download limits (if needed in future)

### Authentication Flow
1. **Unauthenticated User** → Shows lock icon on buttons
2. **Clicks Download/View** → Auth modal pops up
3. **Login/Register** → User authenticates
4. **Page Reloads** → User context established
5. **Action Proceeds** → Download/Payment based on material type

---

## 📊 Download Tracking (Both Types)

### Supabase Table: `material_downloads`
```sql
- user_id: UUID (Supabase user ID)
- user_email: TEXT
- material_id: UUID
- material_title: TEXT
- material_type: TEXT ('free' or 'paid')
- downloaded_at: TIMESTAMP
- UNIQUE(user_id, material_id) -- One count per user per material
```

### Purpose
- Analytics: Track download trends
- User engagement: See which materials are popular
- One-time count: Each user counted once per material

---

## 🎨 UI/UX Separation

### Material Cards

#### FREE Material Card
```
┌─────────────────────────────┐
│     [Thumbnail Image]       │
│   [Class Badge] [Subject]   │
│   [Downloads] [FREE Badge]  │
├─────────────────────────────┤
│   Material Title            │
│   Description...            │
├─────────────────────────────┤
│  [View] [Download]          │  ← Simple buttons
│  Login to download for free │  ← If not logged in
└─────────────────────────────┘
```

#### PAID Material Card (Not Purchased)
```
┌─────────────────────────────┐
│     [Thumbnail Image]       │
│   [Class Badge] [Subject]   │
│   [Downloads] [₹Price]      │
├─────────────────────────────┤
│   Material Title            │
│   Description...            │
├─────────────────────────────┤
│    [Buy for ₹X]             │  ← Razorpay button
└─────────────────────────────┘
```

#### PAID Material Card (Purchased)
```
┌─────────────────────────────┐
│     [Thumbnail Image]       │
│   [Class Badge] [Subject]   │
│   [Downloads] [₹Price]      │
├─────────────────────────────┤
│   Material Title            │
│   Description...            │
├─────────────────────────────┤
│  [View] [Download]          │  ← Same as free
└─────────────────────────────┘
```

---

## 🔧 Admin Panel

### Material Creation
Admin can set material type:

1. **Free Material Toggle** 
   - ON (green) → Material is FREE
   - OFF (gray) → Material is PAID

2. **Price Field**
   - Only shown when toggle is OFF
   - Enter price in INR (₹)

3. **Visual Preview**
   - Free: "This material will be available for free to all users"
   - Paid: "Users will pay ₹X to access this material"

---

## 💾 Database Collections

### MongoDB (Backend - PAID only)
```javascript
// payment_orders - Razorpay orders
{
  id: UUID,
  orderId: String (Razorpay order ID),
  userId: UUID,
  materialId: UUID,
  amount: Number,
  status: String ('created' | 'completed'),
  createdAt: ISO Date
}

// purchases - Completed purchases
{
  id: UUID,
  userId: UUID,
  materialId: UUID,
  orderId: String,
  paymentId: String,
  amount: Number,
  status: String ('completed'),
  purchasedAt: ISO Date
}
```

### Supabase (Both Types)
```sql
-- materials - All materials
id: UUID,
title: TEXT,
subject: TEXT,
class: TEXT,
is_free: BOOLEAN,  -- KEY FIELD
price: INTEGER,    -- Only for paid materials
pdf_url: TEXT,
thumbnail_url: TEXT,
downloads: INTEGER,
created_at: TIMESTAMP

-- material_downloads - Download tracking
user_id: UUID,
material_id: UUID,
material_type: TEXT ('free' or 'paid'),
downloaded_at: TIMESTAMP
```

---

## 🚀 Key Benefits of Separation

1. **Clear Code Structure**
   - Free materials: Simple authentication flow
   - Paid materials: Complete payment integration
   - No mixing of concerns

2. **Maintainability**
   - Easy to modify free material logic without affecting payments
   - Payment changes don't impact free materials
   - Clear separation of responsibilities

3. **Performance**
   - Free materials don't load purchase data
   - Paid materials only query purchases when needed
   - Efficient caching strategies

4. **User Experience**
   - Clear distinction between free and paid
   - No confusion about payment requirements
   - Smooth checkout for paid materials
   - Instant access for free materials

---

## 🔍 Testing Scenarios

### FREE Materials
1. ✅ Unauthenticated user sees lock icon
2. ✅ Click download → Auth modal appears
3. ✅ After login → Download starts immediately
4. ✅ Download tracked in Supabase
5. ✅ Counter increments once per user
6. ✅ No payment APIs called

### PAID Materials
1. ✅ Unauthenticated user sees "Login to Purchase"
2. ✅ After login → "Buy for ₹X" button
3. ✅ Click buy → Razorpay modal opens
4. ✅ Complete payment → Purchase recorded
5. ✅ Download/View buttons appear
6. ✅ Can download after purchase
7. ✅ Purchase persists across sessions

---

## 📝 Summary

| Feature | FREE Materials | PAID Materials |
|---------|---------------|----------------|
| **Authentication** | Required | Required |
| **Payment** | None | Razorpay |
| **Purchase Check** | None | Required |
| **Download Tracking** | Supabase | Supabase |
| **Purchase Records** | None | MongoDB |
| **Backend APIs** | None | 4 payment endpoints |
| **User Flow** | Login → Download | Login → Pay → Download |
| **UI Indicator** | Green "FREE" badge | Yellow "₹Price" badge |

---

## 🎯 Conclusion

The FREE and PAID materials are now **completely separated**:

- **FREE materials** work exactly as before with simple authentication-gated downloads
- **PAID materials** have full Razorpay payment integration with purchase validation
- **No mixing** of payment logic in free material flows
- **Clear separation** in code, UI, and database
- **Easy to maintain** and extend in the future

This separation ensures that free materials remain simple and fast, while paid materials have robust payment handling and purchase validation.
