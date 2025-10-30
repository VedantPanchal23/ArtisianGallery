# 🚀 Postman Quick Start - ArtHive API

## 📥 Import to Postman
1. Open Postman
2. Click **Import** button
3. Select: `ArtHive_Postman_Collection.json`
4. Done! ✓

---

## 🔑 Test Credentials

```
ADMIN:
Email: arjun.sharma@example.com
Password: password123

ARTIST:
Email: priya.patel@example.com
Password: password123

BUYER:
Email: vikram.reddy@example.com
Password: password123
```

---

## 🎯 Quick Test Flow

### 1. Login (Get Token)
```
POST /api/v1/auth/login

Body:
{
  "username": "vikram.reddy@example.com",
  "password": "password123"
}

✓ Token auto-saved to environment!
```

### 2. Browse Artworks (No Auth)
```
GET /api/v1/artworks

✓ Works without login
```

### 3. Like Artwork (Requires Auth)
```
POST /api/v1/artworks/:id/like

Header: Authorization: Bearer {{auth_token}}

✓ Replace :id with actual artwork ID
```

### 4. Create Order (Buyer)
```
POST /api/v1/orders

Header: Authorization: Bearer {{auth_token}}

Body:
{
  "cart": [{ "_id": "ARTWORK_ID", "price": 15000 }],
  "billingAddress": { ... },
  "cardDetails": { ... }
}

✓ Mock payment - instant success
```

### 5. Upload Artwork (Artist)
```
Login as: priya.patel@example.com

POST /api/v1/artworks

Body:
{
  "title": "My Artwork",
  "description": "Description here",
  "price": 15000,
  "category": "abstract",
  "imageUrl": "https://picsum.photos/800/600"
}

✓ Status will be "pending"
```

### 6. Approve Artwork (Admin)
```
Login as: arjun.sharma@example.com

PUT /api/v1/admin/artworks/:id/approve

✓ Changes status to "approved"
```

---

## 📊 All 25 Endpoints

### Authentication (5)
- POST /api/v1/auth/register
- POST /api/v1/auth/login ⭐
- POST /api/v1/auth/send-otp
- POST /api/v1/auth/verify-otp
- POST /api/v1/auth/reset-password

### Artworks (8)
- GET /api/v1/artworks ⭐
- GET /api/v1/artworks/:id
- POST /api/v1/artworks (Artist) ⭐
- PUT /api/v1/artworks/:id (Owner)
- DELETE /api/v1/artworks/:id (Owner)
- POST /api/v1/artworks/:id/like ⭐
- POST /api/v1/artworks/:id/favorite ⭐
- POST /api/v1/artworks/upload-image

### Orders (4)
- POST /api/v1/orders ⭐
- GET /api/v1/orders
- GET /api/v1/orders/:id
- GET /api/v1/orders/check/:artworkId

### Admin (8)
- GET /api/v1/admin/artworks/pending ⭐
- PUT /api/v1/admin/artworks/:id/approve ⭐
- PUT /api/v1/admin/artworks/:id/reject
- GET /api/v1/admin/artworks/all
- GET /api/v1/admin/users
- PUT /api/v1/admin/users/:id/block
- GET /api/v1/admin/analytics ⭐
- GET /api/v1/admin/orders

### Users (3)
- GET /api/v1/users/profile
- PUT /api/v1/users/profile
- GET /api/v1/users/purchased

⭐ = Most commonly used

---

## ⚡ Quick Filters

### Get Artworks with Filters
```
GET /api/v1/artworks?category=portrait
GET /api/v1/artworks?minPrice=5000&maxPrice=50000
GET /api/v1/artworks?search=sunset
GET /api/v1/artworks?sort=price
GET /api/v1/artworks?artist=ARTIST_ID
GET /api/v1/artworks?favorites=USER_ID
```

### Categories
`abstract`, `landscape`, `portrait`, `digital`, `photography`, `illustration`, `3d`, `painting`, `nature`, `urban`, `space`, `other`

---

## 🔧 Common Issues

### ❌ "Authorization token required"
**Fix**: Login first, token auto-saves to `{{auth_token}}`

### ❌ "Only artists can upload"
**Fix**: Login with artist email (priya.patel@example.com)

### ❌ "Only admins allowed"
**Fix**: Login with admin email (arjun.sharma@example.com)

### ❌ "Artwork not found"
**Fix**: Get valid ID from `GET /api/v1/artworks` first

---

## 📝 Response Codes

| Code | Status |
|------|--------|
| 200 | Success ✓ |
| 201 | Created ✓ |
| 400 | Bad Request ❌ |
| 401 | Unauthorized ❌ |
| 403 | Forbidden ❌ |
| 404 | Not Found ❌ |
| 500 | Server Error ❌ |

---

## 🎯 Testing Priority

**Must Test (Core Features):**
1. ✓ Login
2. ✓ Get Artworks
3. ✓ Create Artwork (Artist)
4. ✓ Approve Artwork (Admin)
5. ✓ Create Order (Buyer)
6. ✓ Like/Favorite

**Should Test (Important):**
7. ✓ Register User
8. ✓ Update Artwork
9. ✓ Delete Artwork
10. ✓ Get Orders
11. ✓ Admin Analytics
12. ✓ Block User (Admin)

**Nice to Test (Additional):**
13. ✓ Password Reset Flow
14. ✓ Update Profile
15. ✓ Get Purchased Artworks
16. ✓ Check Purchase Status

---

## 📂 Files Provided

1. **ArtHive_Postman_Collection.json** - Import this to Postman
2. **POSTMAN_TESTING_GUIDE.md** - Detailed testing guide
3. **POSTMAN_QUICK_START.md** - This quick reference (you are here)

---

## 🏁 Start Testing Now!

```bash
# 1. Start Backend
cd backend
npm run dev

# 2. Import collection to Postman
# 3. Run "Login" request
# 4. Start testing! 🚀
```

**All 25+ endpoints ready to test!** ✅

---

**Base URL**: http://localhost:3000  
**Collection**: ArtHive API - Complete Collection  
**Total Requests**: 31 (including variations)
