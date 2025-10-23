# Add Firebase Environment Variables to Vercel

## The Problem
Your build is failing because Firebase credentials are not set in Vercel's environment variables.

Error: `Firebase: Error (auth/invalid-api-key)`

## Quick Fix (5 minutes)

### Step 1: Go to Your Vercel Project Settings
1. Open https://vercel.com/
2. Select your project: **cursoroctoberclassic**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These Environment Variables

Add each of these **one by one** (click "Add New" for each):

**Important:** Set each variable for **Production, Preview, and Development** (check all 3 boxes)

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [Your Firebase API Key from Firebase Console]

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: [Your Firebase Auth Domain]

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: [Your Firebase Project ID]

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: [Your Firebase Storage Bucket]

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: [Your Firebase Messaging Sender ID]

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: [Your Firebase App ID]

Name: NEXT_PUBLIC_EDITOR_PIN
Value: [Your chosen PIN for editor access - e.g., 1234]
```

### Step 3: Get Your Firebase Values

If you don't have these values handy:

1. Go to https://console.firebase.google.com/
2. Select your project: **october-classic-2025**
3. Click the **gear icon** (⚙️) → **Project settings**
4. Scroll down to **Your apps** section
5. Find your web app and click on it
6. Look for the `firebaseConfig` object
7. Copy each value (WITHOUT quotes)

Example of what you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",              // Copy this
  authDomain: "your-project.firebaseapp.com",  // Copy this
  projectId: "your-project-id",      // Copy this
  storageBucket: "your-project.appspot.com",   // Copy this
  messagingSenderId: "123456789",    // Copy this
  appId: "1:123456789:web:abc123"    // Copy this
};
```

### Step 4: Redeploy

After adding all environment variables:

1. Go back to **Deployments** tab in Vercel
2. Click the **three dots** (•••) on the latest deployment
3. Click **Redeploy**
4. Or simply push a new commit (it will auto-deploy)

---

## Alternative: Use Vercel CLI (If You Prefer Terminal)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Add environment variables (run this for each one)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste the value when prompted
# Select: Production, Preview, Development (all 3)
```

---

## After Adding Variables

The build should succeed! You'll see:
- ✓ Compiled successfully
- ✓ Generating static pages
- ✓ Build completed

Then your app will be live at your Vercel URL!

---

**Need help?** The Firebase config should be in your Firebase Console under Project Settings.

