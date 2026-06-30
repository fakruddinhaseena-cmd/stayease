# StayEase — Complete Real-Time Deployment Guide
## Firebase OTP + Supabase + Render + Netlify

---

## OVERVIEW — What you'll set up:

```
User Phone → Firebase OTP SMS → React Frontend (Netlify)
                                      ↓
                              Node.js API (Render.com)
                                      ↓
                         Supabase PostgreSQL (Database)
```

---

## STEP 1 — SUPABASE DATABASE SETUP

### 1.1 Create Supabase Project
1. Go to → https://supabase.com
2. Click **"New Project"**
3. Enter:
   - Project name: `stayease`
   - Database password: (save this!)
   - Region: `Southeast Asia (Singapore)` ← closest to India
4. Click **"Create new project"** (wait 2 minutes)

### 1.2 Run Database Schema
1. In Supabase dashboard → Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open file: `stayease-backend/db/schema.sql`
4. Copy ALL the SQL → Paste into SQL Editor
5. Click **"Run"** (Ctrl+Enter)
6. You should see: "Success. No rows returned"

### 1.3 Get Database URL
1. Go to: Settings → Database → Connection string → URI
2. Copy the URL — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
3. Save this for Step 3

---

## STEP 2 — FIREBASE SETUP (OTP Authentication)

### 2.1 Create Firebase Project
1. Go to → https://console.firebase.google.com
2. Click **"Add project"**
3. Project name: `stayease-app`
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

### 2.2 Enable Phone Authentication
1. In Firebase console → **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Click **"Phone"** provider
4. Toggle **Enable** → Click **"Save"**

### 2.3 Add Web App (for Frontend)
1. Firebase console → Project Overview → Click **"</>"** (Web icon)
2. App nickname: `stayease-web`
3. Click **"Register app"**
4. Copy the config — it looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "stayease-app.firebaseapp.com",
     projectId: "stayease-app",
     appId: "1:123456789:web:abcdef"
   };
   ```
5. Save these values for Step 4 (Frontend .env)

### 2.4 Get Service Account Key (for Backend)
1. Firebase console → Project Settings (gear icon) → **"Service accounts"**
2. Click **"Generate new private key"**
3. A JSON file will download — open it
4. You need these values from JSON:
   - `project_id`
   - `private_key`  
   - `client_email`
5. Save for Step 3 (Backend .env)

### 2.5 Add Authorized Domain
1. Firebase console → Authentication → Settings → **"Authorized domains"**
2. Click **"Add domain"**
3. Add your Netlify URL: `stayease.netlify.app`
4. Also add: `localhost`

---

## STEP 3 — BACKEND SETUP & DEPLOY (Render.com)

### 3.1 Push Backend to GitHub
```bash
# In stayease-backend folder:
git init
git add .
git commit -m "StayEase backend initial commit"

# Create repo on github.com → then:
git remote add origin https://github.com/YOUR_USERNAME/stayease-backend.git
git push -u origin main
```

### 3.2 Create .env File (DO NOT commit this!)
Create file: `stayease-backend/.env`
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://stayease.netlify.app

# From Supabase Step 1.3:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.XXXX.supabase.co:5432/postgres

# JWT (make a random 32+ char string):
JWT_SECRET=StayEase@2026_SuperSecretKey_ChangeThis!
JWT_EXPIRES_IN=7d

# From Firebase Step 2.4 JSON file:
FIREBASE_PROJECT_ID=stayease-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@stayease-app.iam.gserviceaccount.com
```

### 3.3 Deploy to Render.com
1. Go to → https://render.com → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub → Select `stayease-backend` repo
4. Fill in:
   - **Name**: `stayease-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **"Advanced"** → **"Add Environment Variable"**
6. Add ALL variables from your `.env` file one by one
7. Click **"Create Web Service"**
8. Wait 3-5 minutes for deploy
9. Your API URL will be: `https://stayease-api.onrender.com`

### 3.4 Test Backend
Open browser: `https://stayease-api.onrender.com/api/health`
Should show:
```json
{ "success": true, "message": "StayEase API running" }
```

---

## STEP 4 — FRONTEND SETUP & DEPLOY (Netlify)

### 4.1 Create .env File in pgplatform folder
Create file: `pgplatform/.env`
```env
# Your Render.com backend URL:
VITE_API_URL=https://stayease-api.onrender.com/api

# From Firebase Step 2.3:
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=stayease-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stayease-app
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4.2 Install Firebase in Frontend
```bash
cd pgplatform
npm install firebase
```

### 4.3 Build Frontend
```bash
npm run build
```

### 4.4 Deploy to Netlify
**Option A — Drag & Drop (Easiest):**
1. Go to → https://netlify.com → Sign up
2. Drag the `pgplatform/dist` folder into Netlify dashboard
3. Done! You get a URL like: `https://random-name.netlify.app`

**Option B — GitHub (Recommended for auto-deploy):**
1. Push pgplatform to GitHub
2. Netlify → "New site from Git" → Connect GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add Environment Variables (same as .env above)
6. Click Deploy

### 4.5 Add Netlify redirect (for React Router)
Create file: `pgplatform/public/_redirects`
```
/*  /index.html  200
```

---

## STEP 5 — HOW OTP LOGIN WORKS (Flow)

```
User enters phone: 9876543210
         ↓
Firebase sends SMS: "Your StayEase OTP is 847291"
         ↓
User enters 6-digit OTP in app
         ↓
Firebase verifies OTP → returns idToken
         ↓
Frontend sends idToken to: POST /api/auth/verify-otp
         ↓
Backend verifies with Firebase Admin SDK
         ↓
Backend checks if user exists in Supabase:
  - If NEW user → Creates account → Returns JWT
  - If EXISTING user → Returns JWT
         ↓
Frontend stores JWT in localStorage
         ↓
All future API calls use JWT in Authorization header
         ↓
User is logged in! Dashboard opens.
```

---

## STEP 6 — TEST YOUR LIVE APP

### Login as Super Admin:
- Email: `admin@stayease.in`
- Password: `Admin@2026`
- Change password after first login!

### Login as Tenant (OTP):
- Enter any real Indian mobile number
- Receive SMS OTP
- Enter OTP → Auto-register or login

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| OTP not received | Check Firebase Phone Auth is enabled |
| "Firebase not configured" | Add VITE_FIREBASE_ vars to .env |
| Backend not connecting | Check DATABASE_URL in Render env vars |
| CORS error | Add your Netlify URL to FRONTEND_URL in Render |
| Render app sleeping | Free tier sleeps after 15min — first request is slow |
| "Too many requests" | Firebase has 10 OTP/day free limit on test numbers |

---

## FREE TIER LIMITS

| Service | Free Limit |
|---------|-----------|
| Supabase | 500MB DB, 2GB bandwidth/month |
| Firebase Auth | 10,000 verifications/month |
| Render.com | 750 hours/month (sleeps after 15min idle) |
| Netlify | 100GB bandwidth/month |

**For production:** Upgrade Render to paid ($7/month) to avoid sleep.

---

## FOLDER STRUCTURE

```
stayease-backend/          ← Deploy to Render.com
├── server.js              ← Main entry point
├── config/
│   ├── db.js             ← Supabase connection
│   └── firebase.js       ← Firebase Admin
├── middleware/
│   └── auth.js           ← JWT verification
├── controllers/
│   ├── authController.js ← OTP + email login
│   ├── propertyController.js
│   └── paymentController.js
├── routes/
│   └── index.js          ← All API endpoints
├── db/
│   └── schema.sql        ← Run in Supabase SQL Editor
├── .env.example          ← Copy to .env
└── package.json

pgplatform/               ← Deploy to Netlify
├── src/
│   ├── config/
│   │   ├── firebase.js  ← OTP send/verify
│   │   └── api.js       ← All API calls
│   └── pages/           ← All UI pages
├── .env.example          ← Copy to .env
└── package.json
```

---

## SUPPORT

If anything fails, check:
1. Render logs: Dashboard → Your service → "Logs"
2. Browser console: F12 → Console tab
3. Firebase console: Authentication → Users (see registered users)
4. Supabase: Table Editor → users table (see created accounts)
