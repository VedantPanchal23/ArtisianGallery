# 🚀 Quick Start Guide - ArtHive Marketplace

## Prerequisites
- ✅ Node.js installed
- ✅ MongoDB running (localhost:27017)
- ✅ Git repository cloned

---

## 🎯 One-Time Setup

### 1. Install Dependencies

**Backend:**
```cmd
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\backend"
npm install
```

**Frontend:**
```cmd
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\frontend"
npm install
```

### 2. Environment Variables (Optional)

Create `backend/.env` file:
```env
# Email Service (Optional - for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Secret (Optional - has default)
JWT_SECRET=your-secret-key
```

**Note:** App works WITHOUT .env file (uses local storage for images, console logging for OTP)

---

## 🗃️ Database Setup

### Populate Database with Indian User Data

```cmd
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project"
node backend/seedData.js
```

**This Creates:**
- 6 users (3 artists + 2 buyers + 1 admin)
- 8 Indian-themed artworks (7 approved + 1 pending)
- All with authentic Indian names and artwork themes

**Login Credentials Created:**

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin123` | Admin | Platform administrator |
| `priyasharma` | `password123` | Artist | Mumbai digital artist |
| `arjunpatel` | `password123` | Artist | Gujarat photographer |
| `ananyareddy` | `password123` | Artist | Hyderabad artist |
| `rajeshkumar` | `password123` | User | Delhi art collector |
| `meeraiyer` | `password123` | User | Bangalore designer |

---

## ▶️ Start Application

### Terminal 1 - Backend Server

```cmd
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\backend"
npm start
```

**Expected Output:**
```
Server running on http://localhost:3000
Connected to MongoDB
✅ Email service is ready for production use
```

### Terminal 2 - Frontend Dev Server

```cmd
cd "c:\Users\vedan\Desktop\SEM - 5\FullStack\Project\frontend"
npm run dev
```

**Expected Output:**
```
VITE v7.1.7  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🎨 Access the Application

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:3000

---

## 🧪 Test Features

### **As Regular User (Buyer):**

1. **Browse Marketplace**
   - Go to: http://localhost:5173/explore
   - View 7 approved artworks
   - No login required for browsing ✓

2. **Purchase Artwork**
   - Login: `rajeshkumar` / `password123`
   - Click any artwork → "Add to Cart"
   - Go to Cart → "Proceed to Checkout"
   - Fill billing address
   - Enter test card: `4111111111111111` (Visa)
   - Expiry: `12/2025`, CVV: `123`
   - Click "Pay ₹..." → Success!

3. **View Order History**
   - Go to: http://localhost:5173/profile
   - See purchased artworks

### **As Artist:**

1. **Upload Artwork**
   - Login: `priyasharma` / `password123`
   - Go to: http://localhost:5173/upload-artwork
   - Drag & drop image (or browse)
   - Fill form (title, description, price, category, tags)
   - Submit → Status: "Pending Admin Approval"

2. **View My Uploads**
   - Go to: http://localhost:5173/my-uploads
   - See all your artworks with stats

### **As Admin:**

1. **Approve/Reject Artworks**
   - Login: `admin` / `admin123`
   - Use API endpoints (see docs/api-endpoints-complete.txt)
   - GET `/api/v1/admin/artworks/pending`
   - PUT `/api/v1/admin/artworks/:id/approve`

2. **View Analytics**
   - GET `/api/v1/admin/analytics`
   - See platform stats, top artists, revenue

3. **Manage Users**
   - GET `/api/v1/admin/users`
   - PUT `/api/v1/admin/users/:id/block` (block/unblock)

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/seedData.js` | Populate database with test data |
| `docs/api-endpoints-complete.txt` | Complete API documentation (25 endpoints) |
| `IMPLEMENTATION_SUMMARY.md` | Full implementation details |
| `backend/models/` | Database schemas (User, Artwork, Transaction) |
| `frontend/src/components/` | React components (Cart, Checkout, Explore, etc.) |

---

## 🔧 Common Commands

### Reset Database
```cmd
node backend/seedData.js
```
(Clears all data and re-seeds)

### Check Errors
```cmd
# Backend logs
cd backend && npm start

# Frontend logs
cd frontend && npm run dev
```

### Test API Endpoints
Use Postman or curl:
```bash
# Get all artworks
curl http://localhost:3000/api/v1/artworks

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🎯 What Works Right Now

✅ **Authentication System**
- Register, Login, Forgot Password (OTP), Reset Password

✅ **Artwork Management**
- Upload (artist), Browse (public), Like/Favorite (authenticated)
- Admin approval workflow

✅ **Shopping & Checkout**
- Cart (localStorage), Checkout form, Mock payment
- Order history, Transaction tracking

✅ **Database Integration**
- 100% database-driven (no static data)
- MongoDB with Mongoose models
- Proper indexing for performance

✅ **Security**
- JWT authentication (7-day expiry)
- Password hashing (bcrypt, 12 rounds)
- Role-based access control (user/artist/admin)
- Optional vs mandatory auth (browse vs transact)

✅ **Professional UI**
- Stripe-like checkout
- Instagram-inspired login
- Responsive design
- Light/dark theme support

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Start MongoDB service
```cmd
# Windows
net start MongoDB

# Or use MongoDB Compass
```

### Issue: "Module not found"
**Solution:** Install dependencies
```cmd
npm install
```

### Issue: "Port 3000 already in use"
**Solution:** Kill process or change port
```cmd
# Windows
netstat -ano | findstr :3000
taskkill /PID <process-id> /F
```

### Issue: Cart empty after refresh
**Check:** localStorage should persist cart
```javascript
// Browser console
localStorage.getItem('arthive_cart')
```

---

## 📊 Database Check

### Verify Seeded Data

**MongoDB Compass:**
1. Connect to: `mongodb://localhost:27017`
2. Database: `arthive`
3. Collections:
   - `users` → 6 documents
   - `artworks` → 8 documents
   - `transactions` → 0 initially (created after purchases)

**MongoDB Shell:**
```javascript
use arthive

// Check users
db.users.find().pretty()

// Check artworks
db.artworks.find({ status: 'approved' }).count()  // Should be 7

// Check transactions
db.transactions.find().pretty()
```

---

## 🎨 Sample Artworks Created

1. Mumbai Monsoon Dreams - ₹899 (Abstract)
2. Lotus Serenity - ₹599 (Digital)
3. Rajasthan Sunset - ₹1,299 (Landscape)
4. Kathakali Warrior - ₹1,499 (Portrait)
5. Taj Mahal Reflections - ₹1,799 (Photography)
6. Ganesha Blessings - ₹749 (Digital)
7. Kerala Backwaters - ₹999 (Landscape)
8. Holi Colors Explosion - ₹649 (Abstract) [Pending]

---

## 📞 Need Help?

**Documentation Files:**
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `docs/api-endpoints-complete.txt` - API reference
- `README.md` - Project overview

**Check Logs:**
- Backend: Terminal running `npm start`
- Frontend: Terminal running `npm run dev`
- Browser Console: F12 → Console tab

---

## ✨ You're All Set!

**Next Steps:**
1. Explore the marketplace at http://localhost:5173
2. Test different user roles (user, artist, admin)
3. Try the complete purchase flow (browse → cart → checkout → success)
4. Upload artworks as artist
5. Use admin API endpoints for moderation

**Happy Coding! 🎨**
