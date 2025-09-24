# ArtHive Backend - Quick Start Guide

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your MongoDB URI and other settings
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:3000

## Environment Variables (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/arthive

# JWT Secret (change in production)
JWT_SECRET=arthive_super_secret_key_change_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=3000
```

## Testing the API

### 1. Test Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "user"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Test Forgot Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## Frontend Integration

The frontend is already connected to these endpoints:
- Login form: http://localhost:5173/login
- Signup form: http://localhost:5173/signup  
- Forgot password: http://localhost:5173/forgot-password

## Database Schema

User model includes:
- Basic info: name, username, email
- Authentication: hashed password, role, isBlocked
- Content: avatarUrl, bio
- Relationships: purchasedArtworks[], uploadedArtworks[]

## Security Features

- JWT tokens with 7-day expiration
- bcrypt password hashing (12 salt rounds)
- Rate limiting (100 req/15min per IP)
- CORS protection
- Input validation with Joi
- Security headers with Helmet