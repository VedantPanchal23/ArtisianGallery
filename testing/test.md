🧪 1. QA TESTING PLAN — ArtHive
🎯 Objective

To ensure functional correctness, usability, security, and performance stability of ArtHive before production deployment.

🧩 TEST STRATEGY
Type	Description	Tools
Functional Testing	Validate all core & advanced features for correctness	Postman, Cypress
UI/UX Testing	Verify design consistency, responsiveness, accessibility	Manual, Chrome DevTools
Integration Testing	Validate interactions between backend, frontend, DB	Jest + Supertest
Security Testing	Test for authentication, authorization, and data safety	OWASP ZAP, JWT Inspector
Performance Testing	Check load times, rate limiting, DB response	Apache JMeter
Regression Testing	Ensure new fixes don’t break existing features	Cypress (E2E scripts)
User Acceptance Testing (UAT)	End-to-end scenario testing for real user flows	Manual (3 personas)
👥 TEST PERSONAS
Role	Description	Goals
Buyer	Purchases artwork	Browse, search, buy, review
Artist	Uploads and sells artwork	Upload, manage, track stats
Admin	Manages platform	Approve, block, analyze
Guest	Unregistered visitor	View landing, sign up
✅ TEST CASE MATRIX
🔐 Authentication & Authorization
Test ID	Test Description	Expected Result	Status
AUTH-01	Register new buyer/artist/admin	Success message + JWT token	☐
AUTH-02	Login with valid credentials	Redirect to dashboard	☐
AUTH-03	Login with invalid password	401 Unauthorized	☐
AUTH-04	Token expiry (7 days)	Access denied after expiry	☐
AUTH-05	Access artist route as buyer	403 Forbidden	☐
AUTH-06	Forgot password → Email OTP flow	Email sent, password reset works	☐
AUTH-07	Rate limit check (5 login attempts)	429 Too Many Requests	☐
🎨 Artist Features
Test ID	Description	Expected Result	Status
ART-01	Upload valid artwork (image)	Artwork visible in “My Uploads”	☐
ART-02	Upload invalid file (non-image)	400 Invalid File Type	☐
ART-03	Edit artwork title and price	Changes saved successfully	☐
ART-04	Delete artwork	Confirmation + removal	☐
ART-05	View analytics (likes, sales, earnings)	Correct data summary	☐
🛍️ Buyer/User Features
Test ID	Description	Expected Result	Status
BUY-01	Search artwork by title	Results relevant by weight	☐
BUY-02	Filter by price and category	Filtered results accurate	☐
BUY-03	Add to favorites	Favorites list updated	☐
BUY-04	Add to cart and checkout	Order success message	☐
BUY-05	View order history	Past orders displayed	☐
BUY-06	Download artwork (secure link)	File downloads only if token valid	☐
BUY-07	Expired link download attempt	401 Token Expired	☐
👨‍💼 Admin Features
Test ID	Description	Expected Result	Status
ADM-01	View pending artworks	List of unapproved artworks	☐
ADM-02	Approve artwork	Status updated to “approved”	☐
ADM-03	Reject artwork with reason	Notification sent to artist	☐
ADM-04	Block user	User cannot log in	☐
ADM-05	Dashboard analytics	Correct revenue/user metrics	☐
🔔 Notification System
Test ID	Description	Expected Result	Status
NOTI-01	Purchase triggers notification to artist	Real-time bell update	☐
NOTI-02	Follow artist	Notification appears	☐
NOTI-03	Mark all read	Count resets to 0	☐
NOTI-04	Delete notification	Notification removed	☐
⭐ Reviews & Ratings
Test ID	Description	Expected Result	Status
REV-01	Add review (verified buyer)	Review posted	☐
REV-02	Add second review (same buyer)	Error “Already reviewed”	☐
REV-03	Helpful vote	Helpful count increments	☐
💾 File Storage (Cloudinary)
Test ID	Description	Expected Result	Status
CLD-01	Upload image with valid Cloudinary config	Uploaded to CDN	☐
CLD-02	No Cloudinary config → fallback	File stored locally	☐
📧 Email Service
Test ID	Description	Expected Result	Status
MAIL-01	Forgot password OTP	Email delivered	☐
MAIL-02	Order confirmation	Email delivered	☐
MAIL-03	Artwork approval	Artist receives email	☐
🧱 Performance Tests
Test ID	Description	Metric	Expected
PERF-01	Homepage load time	<2 seconds	☐
PERF-02	1000 concurrent users	No crash	☐
PERF-03	Rate limiting check	Blocks after threshold	☐
🔒 Security Tests
Test ID	Description	Expected Result	Status
SEC-01	SQL injection attempt	Blocked by Mongoose ORM	☐
SEC-02	XSS injection in comment	Escaped safely	☐
SEC-03	Invalid JWT access	403 Unauthorized	☐
SEC-04	Password hash check	Stored as bcrypt hash	☐
🧰 AUTOMATION PLAN
Area	Tool	Description
Unit Tests	Jest	API unit coverage
API Tests	Supertest	Test 50+ routes
UI/E2E Tests	Cypress	Buyer-Artist-Admin workflows
Performance	JMeter	Load testing up to 1000 req/min
Coverage Goal	80%+	CI/CD ready
🧾 QA DELIVERABLES

✅ QA Checklist Report (Excel or Notion)

✅ Postman Collection (50+ endpoints)

✅ Test Execution Logs

✅ Bug Tracker (Notion/Jira)

✅ Final QA Sign-off Document

📘 2. PRODUCT REQUIREMENTS DOCUMENT (PRD)
🖼️ Product Name

ArtHive — The Artist-Buyer Social Commerce Platform

🎯 Purpose

To provide a platform where artists can upload and sell digital artworks, buyers can discover and purchase them, and admins can manage the ecosystem — all under a secure, scalable MERN infrastructure.

🧩 Product Summary
Aspect	Description
Type	MERN stack web platform
Users	Artist, Buyer, Admin
Business Model	Commission per sale, community engagement
USP	Social features + e-commerce + real-time notifications
Tech Stack	React + Node.js + Express + MongoDB + Cloudinary
🧭 Product Goals

Empower artists to monetize their digital art securely.

Provide buyers a social marketplace with trust (verified purchase, reviews).

Offer admins a data-driven control system for moderation and analytics.

Maintain high security, performance, and usability.

💡 Key Features
Module	Core Features
Authentication	JWT login, bcrypt passwords, forgot password via OTP
Artist Module	Upload, edit, delete, analytics, follower system
Buyer Module	Search, filter, purchase, favorites, order history
Admin Module	Approvals, user management, analytics
Notifications	8 event types, real-time updates
Reviews	Verified purchase reviews, 5-star system
File Storage	Cloudinary + local fallback
Payments	Mock checkout, Stripe-like UI
Security	JWT, role-based access, rate limiting, validation
Email System	Nodemailer (production ready)
🧱 System Architecture

Frontend: React (Vite)
Backend: Node.js (Express)
Database: MongoDB (Mongoose)
Storage: Cloudinary or local
Auth: JWT + bcrypt
Mail: Nodemailer
Deployment: Render / Vercel

Architecture Flow:

User → Frontend (React) → REST API → Backend (Express)
                                 ↳ MongoDB (Data)
                                 ↳ Cloudinary (Images)
                                 ↳ Nodemailer (Email)

🧮 KPIs (Key Performance Indicators)
Metric	Target
Uptime	99.9%
Response Time	< 200ms per API
Error Rate	< 1%
User Growth	10% monthly
Avg. Order Value	₹500+
Conversion Rate	8%+
🔒 Security Requirements

JWT-based authentication

Rate limiting (100 req/15min)

Password hashing (bcrypt)

HTTPS enforced

CSRF protection (future)

XSS sanitization

📦 Functional Requirements
ID	Requirement	Priority
FR-01	Users can register/login/logout	High
FR-02	Artists can upload artworks	High
FR-03	Buyers can purchase artworks	High
FR-04	Admin can approve/reject artworks	High
FR-05	Notifications are delivered in real-time	High
FR-06	Email notifications for transactions	Medium
FR-07	Secure downloads with expiring links	Medium
FR-08	Review and rating system	Medium
FR-09	Analytics dashboards	Medium
FR-10	Cloudinary storage integration	Medium
⚙️ Non-Functional Requirements
Type	Requirement
Performance	API <200ms, Page load <2s
Scalability	Handle 10K concurrent users
Reliability	No data loss during crash
Maintainability	Modular architecture
Security	All sensitive data encrypted
Usability	Responsive, mobile-friendly UI
📅 Release Plan
Phase	Duration	Deliverables
Phase 1	Week 1	Core features (Auth, Uploads, Purchase)
Phase 2	Week 2	Notifications, Reviews, Admin
Phase 3	Week 3	Email, Cloudinary, Testing
Phase 4	Week 4	Deployment + QA Sign-off
🧠 Future Enhancements

Real Stripe integration

Artist public profiles

Two-factor authentication

Watermarking system

Redis caching for performance

AI art recommendations

🏁 Acceptance Criteria

100% of core user flows pass QA checklist

All APIs return correct responses (status 200/201)

Auth, notifications, uploads fully functional

Admin can manage platform end-to-end

No critical or high-severity bugs open

🧾 APPROVAL SECTION
Role	Name	Signature	Date
Project Owner	Om Choksi	☐	☐
QA Lead	—	☐	☐
Senior Developer	—	☐	☐
🧭 Final Deliverables Summary

✅ QA Test Suite (Manual + Automated)
✅ PRD Document (This file)
✅ Deployment Readiness Checklist
✅ Demo Script