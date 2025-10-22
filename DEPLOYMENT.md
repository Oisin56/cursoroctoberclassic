# Deployment Guide - The October Classic 2025

Quick reference guide for deploying this application to Vercel with Firebase.

## Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Anonymous Authentication enabled
- [ ] Firestore security rules deployed
- [ ] Firebase configuration values obtained
- [ ] GitHub repository created (optional but recommended)

## Step-by-Step Deployment

### 1. Firebase Console Setup

1. **Create Firestore Database**
   - Navigate to Firebase Console → Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select closest region (e.g., europe-west1 for Ireland/UK)

2. **Enable Anonymous Auth**
   - Navigate to Authentication
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Anonymous" provider
   - Save

3. **Deploy Security Rules**
   - Navigate to Firestore Database → Rules
   - Copy the entire contents of `firestore.rules`
   - Paste into the rules editor
   - Click "Publish"

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Add app" → Web (</>) if not already added
   - Copy these values:
     - API Key
     - Auth Domain
     - Project ID
     - Storage Bucket
     - Messaging Sender ID
     - App ID

### 2. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Or upload the project folder directly

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID = your-app-id
   NEXT_PUBLIC_EDITOR_PIN = 0509
   ```

   **Important**: Add variables to all three environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (typically 1-2 minutes)
   - Visit your deployed site at `your-project.vercel.app`

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
   vercel env add NEXT_PUBLIC_EDITOR_PIN
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### 3. Post-Deployment Setup

1. **Initialize Database**
   - Visit your deployed site
   - Click "I'm the Scorer"
   - Enter PIN: `0509`
   - Click "Initialize Database"
   - Confirm the operation

2. **Verify Data**
   - Check Firebase Console → Firestore
   - You should see:
     - `events` collection with 1 document
     - `courses` collection with 8 documents
     - `rounds` collection with 8 documents
     - `events/{eventId}/controls/access` document

3. **Test Editor Lock**
   - Sign in with PIN
   - Verify you can edit scores
   - Click "Release Editor"
   - Verify you can no longer edit

4. **Test Real-time Updates**
   - Open site in two browser windows
   - Sign in as editor in one window
   - Make changes and verify they appear in second window

### 4. Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Firebase Auth Domain**
   - Go to Firebase Console → Authentication → Settings
   - Add your custom domain to "Authorized domains"

## Environment Variables Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyC...` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `october-classic.firebaseapp.com` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `october-classic-2025` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `october-classic.appspot.com` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase messaging ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc...` | Firebase app ID |
| `NEXT_PUBLIC_EDITOR_PIN` | `0509` | PIN for editor access |

## Updating the Deployment

### For Code Changes

**Via Git (Recommended)**
```bash
git add .
git commit -m "Update description"
git push
```
Vercel will automatically deploy on push to main branch.

**Via Vercel CLI**
```bash
vercel --prod
```

### For Environment Variables

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Update the variable value
3. Redeploy: Project → Deployments → ⋯ → Redeploy

## Monitoring & Analytics

### Vercel Analytics
- Go to Project → Analytics to view:
  - Page views
  - Unique visitors
  - Performance metrics

### Firebase Usage
- Go to Firebase Console → Usage and billing
- Monitor:
  - Firestore reads/writes
  - Authentication users
  - Storage usage

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
- Ensure variable names start with `NEXT_PUBLIC_`
- Verify variables are set for correct environment
- Redeploy after changing variables

### Firestore Permission Denied
- Check that security rules are deployed
- Verify editor lock is claimed (signed in with PIN)
- Check browser console for specific error messages

### Real-time Updates Not Working
- Ensure Firestore is in Native mode (not Datastore mode)
- Check network tab for WebSocket connections
- Verify Firestore rules allow read access

### Domain Issues
- Verify DNS records are correctly configured
- Add custom domain to Firebase authorized domains
- Wait for DNS propagation (up to 48 hours)

## Performance Optimization

### Firestore Indexes
If queries are slow, create indexes:
- Go to Firestore → Indexes
- Add composite index for: `rounds` → `eventId` (ASC) + `sequence` (ASC)

### Vercel Edge Functions
Already optimized with App Router - no additional setup needed.

### Image Optimization
If adding images, use Next.js `<Image>` component for automatic optimization.

## Backup & Recovery

### Export Firestore Data
```bash
gcloud firestore export gs://[BUCKET_NAME]
```

### Manual Backup
Use Firebase Console → Firestore → Import/Export

## Cost Estimates

### Firebase Free Tier Limits
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Authentication**: Unlimited
- **Storage**: 1 GB

**Estimated Usage for October Classic:**
- ~5,000 reads per day (viewers checking scores)
- ~500 writes per day (score updates)
- Well within free tier ✅

### Vercel Free Tier
- 100 GB bandwidth per month
- Unlimited deployments
- Typically sufficient for private tournament ✅

## Security Checklist

- [x] Firestore security rules deployed
- [x] Anonymous auth configured
- [x] Editor PIN set in environment variables
- [ ] Consider changing default PIN (0509)
- [ ] Share app URL only with tournament participants
- [ ] Keep Firebase config secure (use environment variables only)

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Firebase: [firebase.google.com/support](https://firebase.google.com/support)

For app-specific issues, check the README.md troubleshooting section.

