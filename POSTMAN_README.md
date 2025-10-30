# 📦 Postman Collection - Ready to Use!

## ✅ What You Got

I've created a **complete Postman collection** with all **25 API endpoints** for your ArtHive backend!

### 📁 Files Created:
1. ✅ **ArtHive_Postman_Collection.json** - The main collection file
2. ✅ **POSTMAN_TESTING_GUIDE.md** - Detailed step-by-step testing guide
3. ✅ **POSTMAN_QUICK_START.md** - Quick reference card

---

## 🚀 How to Use

### Step 1: Import to Postman
```
1. Open Postman
2. Click "Import" button (top left)
3. Select: ArtHive_Postman_Collection.json
4. Click "Import"
5. Done! ✓
```

### Step 2: Start Testing
```
1. Make sure backend is running: npm run dev
2. Open "Authentication" folder
3. Run "Login" request
4. Token auto-saves to environment!
5. Start testing other endpoints ✓
```

---

## 📊 Collection Contents

### 🔐 Authentication (5 endpoints)
- ✅ Register User
- ✅ Login (auto-saves token!)
- ✅ Send OTP
- ✅ Verify OTP
- ✅ Reset Password

### 🎨 Artworks (8 endpoints)
- ✅ Get All Artworks (with filters)
- ✅ Get Single Artwork
- ✅ Create Artwork (Artist only)
- ✅ Update Artwork (Owner only)
- ✅ Delete Artwork (Owner only)
- ✅ Toggle Like
- ✅ Toggle Favorite
- ✅ Upload Image to Cloudinary

### 🛒 Orders (4 endpoints)
- ✅ Create Order
- ✅ Get User Orders
- ✅ Get Single Order
- ✅ Check Purchase Status

### 👨‍💼 Admin (8 endpoints)
- ✅ Get Pending Artworks
- ✅ Approve Artwork
- ✅ Reject Artwork (with reason)
- ✅ Get All Artworks
- ✅ Get All Users
- ✅ Block/Unblock User
- ✅ Get Analytics
- ✅ Get All Orders

### 👤 Users (3 endpoints)
- ✅ Get Profile
- ✅ Update Profile
- ✅ Get Purchased Artworks

**Total: 28 requests with all variations!**

---

## 🔑 Pre-configured Test Data

### Login Credentials (Already in Collection)
```json
Admin:
{
  "username": "arjun.sharma@example.com",
  "password": "password123"
}

Artist:
{
  "username": "priya.patel@example.com",
  "password": "password123"
}

Buyer:
{
  "username": "vikram.reddy@example.com",
  "password": "password123"
}
```

### Sample Request Bodies
All requests come with **pre-filled sample data**:
- ✅ Registration data
- ✅ Login credentials
- ✅ Artwork creation data
- ✅ Order with cart items
- ✅ Billing address
- ✅ Card details (mock)
- ✅ And more!

---

## ⚡ Special Features

### 1. Auto-Save Token
When you login, the token is **automatically saved** to environment variable `{{auth_token}}`!

```javascript
// Script included in Login request
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
    pm.environment.set("user_id", jsonData.user._id);
}
```

### 2. Query Parameters
All GET requests include **disabled query parameters** that you can enable:
- `?page=1&limit=10` - Pagination
- `?category=portrait` - Filter by category
- `?search=sunset` - Search
- `?minPrice=5000&maxPrice=50000` - Price range
- `?sort=price` - Sorting
- And more!

### 3. Detailed Descriptions
Every request includes:
- 📝 Description of what it does
- 🔒 Authentication requirements
- ⚠️ Special notes (e.g., "Artist only", "Admin only")

---

## 🧪 Recommended Testing Flow

### Quick Test (5 minutes)
1. Login as Buyer ✓
2. Get All Artworks ✓
3. Like an Artwork ✓
4. Create Order ✓
5. View Orders ✓

### Full Test (20 minutes)
1. **Authentication**: Login as all 3 roles
2. **Browse**: Get artworks with filters
3. **Artist**: Upload artwork
4. **Admin**: Approve artwork
5. **Buyer**: Complete purchase
6. **Engagement**: Like, favorite
7. **Admin**: View analytics
8. **User Management**: Block/unblock

### Comprehensive Test (45 minutes)
- Test all 28 endpoints
- Try edge cases (invalid data, wrong roles)
- Test error handling
- Verify response codes
- Check data relationships

---

## 📖 Documentation Files

### 1. POSTMAN_QUICK_START.md
- ⚡ Quick reference card
- 🔑 Login credentials
- 📊 All endpoints at a glance
- 🔧 Common issues & fixes

### 2. POSTMAN_TESTING_GUIDE.md
- 📝 Step-by-step testing instructions
- 🎯 Complete test scenarios
- ✅ Testing checklist
- 🛠️ Troubleshooting guide
- 💡 Pro tips

---

## 🎯 What to Test

### Must Test (Critical):
- [x] Login
- [x] Get Artworks
- [x] Create Artwork (Artist)
- [x] Approve Artwork (Admin)
- [x] Create Order
- [x] Like/Favorite

### Should Test (Important):
- [x] Register User
- [x] Update Artwork
- [x] Delete Artwork
- [x] Get Orders
- [x] Admin Analytics
- [x] Block User

### Nice to Test:
- [x] Password Reset Flow
- [x] Profile Update
- [x] Purchase History
- [x] Search & Filters

---

## ⚠️ Before Testing

### Make sure:
1. ✅ MongoDB is running
2. ✅ Backend server is running (port 3000)
3. ✅ Database is seeded with test data
4. ✅ Postman is installed

### Start Backend:
```bash
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\backend"
npm run dev
```

**Expected Output:**
```
Connected to MongoDB ✓
✅ Email service is ready
Server running on port 3000 ✓
```

---

## 🔍 How to Find Artwork IDs

Many requests need artwork IDs. Here's how to get them:

1. **Run**: `GET /api/v1/artworks`
2. **Copy** any `_id` from response
3. **Paste** into requests that need `:id`

Example response:
```json
{
  "artworks": [
    {
      "_id": "673456789abcdef012345678",  // <-- Copy this!
      "title": "Beautiful Sunset",
      ...
    }
  ]
}
```

---

## 💡 Pro Tips

### 1. Create Environment
```
1. Click "Environments" in Postman
2. Create "ArtHive Local"
3. Add variables:
   - base_url: http://localhost:3000
   - auth_token: (auto-filled)
   - user_id: (auto-filled)
4. Select this environment
```

### 2. Use Collection Runner
```
1. Click "Runner" button
2. Select "ArtHive API" collection
3. Choose requests to run
4. Click "Run ArtHive API"
5. See all results at once!
```

### 3. Save Example Responses
```
1. Run a request
2. Click "Save Response"
3. Name it as "Example"
4. View later for reference
```

### 4. Organize Tests
```
1. Mark tested requests with ✓
2. Use folders to group related tests
3. Add notes for failed tests
4. Save IDs in environment for reuse
```

---

## 📊 Expected Response Formats

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "token": "...",  // For login/register
  "pagination": { ... }  // For list endpoints
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## 🎉 You're All Set!

### What You Can Do Now:
✅ Test all 25 backend API endpoints  
✅ Verify authentication & authorization  
✅ Test CRUD operations  
✅ Test admin functionalities  
✅ Test order flow  
✅ Test engagement features  
✅ Verify error handling  
✅ Check response formats  

### Files Location:
```
Project/
├── ArtHive_Postman_Collection.json  ← Import this!
├── POSTMAN_TESTING_GUIDE.md         ← Read this!
├── POSTMAN_QUICK_START.md           ← Quick reference
└── POSTMAN_README.md                ← You are here
```

---

## 🚀 Start Testing Now!

1. **Import collection** to Postman
2. **Start backend** server
3. **Run Login** request
4. **Test other endpoints** ✓

**Happy Testing! All 25+ API endpoints ready to test! 🎯**

---

## 📞 Need Help?

- Check **POSTMAN_TESTING_GUIDE.md** for detailed instructions
- Check **POSTMAN_QUICK_START.md** for quick reference
- Check **DIAGNOSTIC_REPORT.md** for full system details
- Check backend console for error logs

---

**Collection Version**: 1.0  
**Total Endpoints**: 25  
**Total Requests**: 28 (with variations)  
**Base URL**: http://localhost:3000  
**Status**: ✅ Ready to Use
