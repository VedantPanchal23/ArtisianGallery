# 🧪 Postman API Testing Guide - ArtHive

## 📥 Import Instructions

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select file: `ArtHive_Postman_Collection.json`
4. Click **Import**

### Step 2: Create Environment (Optional but Recommended)
1. Click **Environments** (left sidebar)
2. Click **+** to create new environment
3. Name it: `ArtHive Local`
4. Add variables:
   - `base_url` = `http://localhost:3000`
   - `auth_token` = (leave empty, will auto-fill)
   - `user_id` = (leave empty, will auto-fill)
5. **Save** and **Select** this environment

---

## 🚀 Testing Workflow

### ✅ Prerequisites
Make sure your backend is running:
```bash
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\backend"
npm run dev
```

**Expected Output:**
```
Connected to MongoDB
✅ Email service is ready
Server running on port 3000
```

---

## 📝 Testing Order (Recommended)

### 1️⃣ Authentication Tests

#### Test 1.1: Login as Buyer
- **Request**: `POST /api/v1/auth/login`
- **Body**:
```json
{
  "username": "vikram.reddy@example.com",
  "password": "password123"
}
```
- **Expected**: Status 200, token returned
- **Note**: Token is auto-saved to environment!

#### Test 1.2: Login as Artist
- **Body**:
```json
{
  "username": "priya.patel@example.com",
  "password": "password123"
}
```

#### Test 1.3: Login as Admin
- **Body**:
```json
{
  "username": "arjun.sharma@example.com",
  "password": "password123"
}
```

#### Test 1.4: Register New User
- **Request**: `POST /api/v1/auth/register`
- **Body**:
```json
{
  "name": "New Test User",
  "username": "newtestuser",
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "mobile": "9876543210",
  "role": "user"
}
```
- **Expected**: Status 201, user created with token

#### Test 1.5: Password Reset Flow
1. **Send OTP**: `POST /api/v1/auth/send-otp`
   - Body: `{ "email": "vikram.reddy@example.com" }`
   - Check console for OTP (development mode)
   
2. **Verify OTP**: `POST /api/v1/auth/verify-otp`
   - Body: `{ "email": "vikram.reddy@example.com", "otp": "123456" }`
   
3. **Reset Password**: `POST /api/v1/auth/reset-password`
   - Body: `{ "email": "vikram.reddy@example.com", "newPassword": "newpass123", "confirmPassword": "newpass123" }`

---

### 2️⃣ Artwork Tests (Public Access)

#### Test 2.1: Get All Artworks
- **Request**: `GET /api/v1/artworks`
- **Expected**: Status 200, array of artworks
- **Note**: No authentication required

#### Test 2.2: Get Artworks with Filters
- **URL**: `GET /api/v1/artworks?category=portrait&minPrice=5000&maxPrice=50000`
- **Expected**: Filtered results

#### Test 2.3: Search Artworks
- **URL**: `GET /api/v1/artworks?search=sunset`
- **Expected**: Artworks matching search term

#### Test 2.4: Get Single Artwork
- **Request**: `GET /api/v1/artworks/:id`
- **Replace** `:id` with actual artwork ID from previous response
- **Expected**: Single artwork details

---

### 3️⃣ Artwork Tests (Artist Only)

**⚠️ Important**: Login as artist first!
```json
{
  "username": "priya.patel@example.com",
  "password": "password123"
}
```

#### Test 3.1: Create Artwork
- **Request**: `POST /api/v1/artworks`
- **Headers**: 
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "title": "Test Artwork from Postman",
  "description": "This is a test artwork created via Postman API testing",
  "price": 15000,
  "currency": "INR",
  "category": "abstract",
  "tags": ["test", "postman", "api"],
  "imageUrl": "https://picsum.photos/800/600",
  "thumbnailUrl": "https://picsum.photos/400/300"
}
```
- **Expected**: Status 201, artwork created with `pending` status
- **Save the artwork ID** for next tests!

#### Test 3.2: Update Artwork
- **Request**: `PUT /api/v1/artworks/:id`
- **Replace** `:id` with your artwork ID
- **Body**:
```json
{
  "title": "Updated Title",
  "price": 20000
}
```
- **Expected**: Status 200, artwork updated

#### Test 3.3: Get Artist's Artworks
- **Request**: `GET /api/v1/artworks?artist={{user_id}}`
- **Expected**: Only artworks by logged-in artist

#### Test 3.4: Delete Artwork
- **Request**: `DELETE /api/v1/artworks/:id`
- **Replace** `:id` with artwork ID
- **Expected**: Status 200, artwork deleted (soft delete)

---

### 4️⃣ Engagement Tests (Like & Favorite)

**⚠️ Must be logged in** (any role)

#### Test 4.1: Like Artwork
- **Request**: `POST /api/v1/artworks/:id/like`
- **Replace** `:id` with artwork ID
- **Expected**: Status 200, like toggled
- **Test again**: Should unlike

#### Test 4.2: Favorite Artwork
- **Request**: `POST /api/v1/artworks/:id/favorite`
- **Replace** `:id` with artwork ID
- **Expected**: Status 200, favorite toggled

#### Test 4.3: Get Favorited Artworks
- **Request**: `GET /api/v1/artworks?favorites={{user_id}}`
- **Expected**: Array of favorited artworks

---

### 5️⃣ Order Tests (Buyer)

**⚠️ Login as buyer**:
```json
{
  "username": "vikram.reddy@example.com",
  "password": "password123"
}
```

#### Test 5.1: Create Order
- **Request**: `POST /api/v1/orders`
- **Body**:
```json
{
  "cart": [
    {
      "_id": "REPLACE_WITH_APPROVED_ARTWORK_ID",
      "title": "Beautiful Sunset",
      "price": 15000,
      "quantity": 1
    }
  ],
  "billingAddress": {
    "fullName": "Vikram Reddy",
    "address": "123 Main Street, Andheri",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "phone": "9876543210"
  },
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "Vikram Reddy"
  }
}
```
- **Expected**: Status 201, order created
- **Note**: Payment is mocked!

#### Test 5.2: Get User's Orders
- **Request**: `GET /api/v1/orders`
- **Expected**: Array of user's orders

#### Test 5.3: Get Single Order
- **Request**: `GET /api/v1/orders/:id`
- **Replace** `:id` with order ID from previous response
- **Expected**: Complete order details

#### Test 5.4: Check Purchase Status
- **Request**: `GET /api/v1/orders/check/:artworkId`
- **Replace** `:artworkId` with artwork ID
- **Expected**: `{ "purchased": true/false }`

---

### 6️⃣ User Profile Tests

**⚠️ Must be logged in**

#### Test 6.1: Get Profile
- **Request**: `GET /api/v1/users/profile`
- **Expected**: Current user's profile data

#### Test 6.2: Update Profile
- **Request**: `PUT /api/v1/users/profile`
- **Body**:
```json
{
  "name": "Updated Name",
  "bio": "Updated bio from Postman",
  "avatarUrl": "https://i.pravatar.cc/150"
}
```
- **Expected**: Status 200, profile updated

#### Test 6.3: Get Purchased Artworks
- **Request**: `GET /api/v1/users/purchased`
- **Expected**: Array of purchased artworks

---

### 7️⃣ Admin Tests

**⚠️ MUST login as admin**:
```json
{
  "username": "arjun.sharma@example.com",
  "password": "password123"
}
```

#### Test 7.1: Get Pending Artworks
- **Request**: `GET /api/v1/admin/artworks/pending`
- **Expected**: Array of pending artworks awaiting approval

#### Test 7.2: Approve Artwork
- **Request**: `PUT /api/v1/admin/artworks/:id/approve`
- **Replace** `:id` with pending artwork ID
- **Expected**: Status 200, artwork approved

#### Test 7.3: Reject Artwork
- **Request**: `PUT /api/v1/admin/artworks/:id/reject`
- **Body**:
```json
{
  "reason": "Image quality does not meet platform standards"
}
```
- **Expected**: Status 200, artwork rejected with reason

#### Test 7.4: Get All Artworks (Admin View)
- **Request**: `GET /api/v1/admin/artworks/all`
- **Optional params**: `?status=pending` or `?status=approved`
- **Expected**: All artworks with admin-level data

#### Test 7.5: Get All Users
- **Request**: `GET /api/v1/admin/users`
- **Optional params**: `?role=artist`
- **Expected**: Array of all users

#### Test 7.6: Block User
- **Request**: `PUT /api/v1/admin/users/:id/block`
- **Body**:
```json
{
  "block": true
}
```
- **Expected**: Status 200, user blocked

#### Test 7.7: Unblock User
- **Request**: `PUT /api/v1/admin/users/:id/block`
- **Body**:
```json
{
  "block": false
}
```
- **Expected**: Status 200, user unblocked

#### Test 7.8: Get Analytics
- **Request**: `GET /api/v1/admin/analytics`
- **Expected**: Platform statistics:
  - Total users, artists, buyers
  - Total artworks by status
  - Total sales and revenue
  - Top selling artworks
  - Category distribution

#### Test 7.9: Get All Orders (Admin)
- **Request**: `GET /api/v1/admin/orders`
- **Optional params**: `?status=completed`
- **Expected**: Array of all orders

---

## 🔍 Common Test Scenarios

### Scenario 1: Complete Purchase Flow
1. Login as buyer
2. Browse artworks (GET /artworks)
3. Like an artwork (POST /artworks/:id/like)
4. Favorite an artwork (POST /artworks/:id/favorite)
5. Create order (POST /orders)
6. View orders (GET /orders)
7. Check purchase status (GET /orders/check/:artworkId)

### Scenario 2: Artist Upload Flow
1. Login as artist
2. Create artwork (POST /artworks)
3. Get artist's artworks (GET /artworks?artist=:id)
4. Wait for admin approval
5. Update artwork (PUT /artworks/:id)
6. View stats in "My Uploads"

### Scenario 3: Admin Approval Flow
1. Login as admin
2. Get pending artworks (GET /admin/artworks/pending)
3. Approve some (PUT /admin/artworks/:id/approve)
4. Reject some with reason (PUT /admin/artworks/:id/reject)
5. View analytics (GET /admin/analytics)

---

## 📊 Expected Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Role not allowed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## 🛠️ Troubleshooting

### Issue: "Authorization token required"
**Solution**: Make sure you're logged in and token is in environment:
1. Run login request
2. Check if `{{auth_token}}` is saved
3. Verify Authorization header: `Bearer {{auth_token}}`

### Issue: "Only artists can upload"
**Solution**: Login with artist credentials:
- priya.patel@example.com / password123

### Issue: "Only admins allowed"
**Solution**: Login with admin credentials:
- arjun.sharma@example.com / password123

### Issue: "Artwork not found"
**Solution**: 
1. First get artworks: `GET /api/v1/artworks`
2. Copy a valid artwork `_id`
3. Use it in your request

### Issue: "Some artworks are no longer available"
**Solution**: Make sure artwork status is `approved`:
1. Login as admin
2. Approve artwork: `PUT /admin/artworks/:id/approve`
3. Then try ordering

---

## 📝 Quick Reference

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | arjun.sharma@example.com | password123 |
| Artist | priya.patel@example.com | password123 |
| Buyer | vikram.reddy@example.com | password123 |

### Categories
`abstract`, `landscape`, `portrait`, `digital`, `photography`, `illustration`, `3d`, `painting`, `nature`, `urban`, `space`, `other`

### Currencies
`INR`, `USD`, `EUR`, `GBP`

### Artwork Status
`pending`, `approved`, `rejected`

### Order Status
`pending`, `completed`, `failed`, `refunded`

### User Roles
`user` (buyer), `artist`, `admin`

---

## ✅ Testing Checklist

### Authentication (5/5)
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Send OTP for password reset
- [ ] Complete password reset flow

### Artworks - Public (4/4)
- [ ] Get all artworks (no auth)
- [ ] Get with filters (category, price)
- [ ] Search artworks
- [ ] Get single artwork

### Artworks - Artist (4/4)
- [ ] Create artwork (artist only)
- [ ] Update own artwork
- [ ] Delete own artwork
- [ ] Get artist's artworks

### Engagement (3/3)
- [ ] Like/unlike artwork
- [ ] Add/remove favorite
- [ ] Get favorited artworks

### Orders (4/4)
- [ ] Create order
- [ ] Get user's orders
- [ ] Get single order
- [ ] Check purchase status

### User Profile (3/3)
- [ ] Get profile
- [ ] Update profile
- [ ] Get purchased artworks

### Admin (8/8)
- [ ] Get pending artworks
- [ ] Approve artwork
- [ ] Reject artwork
- [ ] Get all artworks
- [ ] Get all users
- [ ] Block/unblock user
- [ ] Get analytics
- [ ] Get all orders

**Total Tests**: 31 endpoints ✓

---

## 🎯 Pro Tips

1. **Use Environment Variables**: Set `{{auth_token}}` and `{{user_id}}` for easier testing
2. **Test in Order**: Follow the recommended workflow to avoid dependency issues
3. **Save IDs**: When creating resources, save their IDs for subsequent tests
4. **Check Console**: Backend logs show useful debugging info
5. **Test Edge Cases**: Try invalid data, missing fields, wrong roles
6. **Use Collections Runner**: Run all tests automatically in sequence

---

**Happy Testing! 🚀**

All 25+ API endpoints are ready to test in Postman!
