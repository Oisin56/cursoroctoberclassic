# Complete Setup Guide - GitHub & Vercel

Your project is now committed to Git! Follow these steps to complete the setup.

## ✅ Already Done
- [x] Git initialized
- [x] All files committed

## 🔄 Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. **Go to GitHub**
   - Visit [github.com/new](https://github.com/new)
   - Or click the "+" icon → "New repository"

2. **Repository Settings**
   - **Repository name**: `october-classic-2025` (or your preferred name)
   - **Description**: "Live scoring system for The October Classic 2025 golf tournament"
   - **Visibility**: Choose **Private** (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Create Repository**
   - Click "Create repository" button
   - You'll see a page with setup instructions
   - Copy the repository URL (looks like: `https://github.com/yourusername/october-classic-2025.git`)

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create october-classic-2025 --private --source=. --remote=origin --push
```

## 🔗 Step 2: Connect to GitHub

Run these commands in your terminal:

```bash
cd "/Users/oisinocarroll/ely-medical/.git/october classic"

# Add GitHub as remote (replace URL with yours from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/october-classic-2025.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

## 🚀 Step 3: Deploy to Vercel

### Option A: Using Vercel Web Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub (or your preferred method)

2. **Import Repository**
   - Click "Import Git Repository"
   - Find `october-classic-2025` in the list
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - Keep all defaults

4. **Add Environment Variables**
   
   Before deploying, click "Environment Variables" and add these:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase app ID |
   | `NEXT_PUBLIC_EDITOR_PIN` | `0509` (or your custom PIN) |

   **Important**: For each variable, select all three environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Deploy**
   - Click "Deploy" button
   - Wait 1-2 minutes for build
   - 🎉 Your app is live!

### Option B: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "/Users/oisinocarroll/ely-medical/.git/october classic"
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - What's your project's name? `october-classic-2025`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**

4. **Add Environment Variables via CLI**
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
   vercel env add NEXT_PUBLIC_EDITOR_PIN
   ```
   
   For each command, paste the value when prompted and select all three environments.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔥 Step 4: Firebase Setup

If you haven't set up Firebase yet:

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Add project"
   - Name it "October Classic 2025"
   - Follow the setup wizard

2. **Enable Firestore**
   - In Firebase Console, click "Firestore Database"
   - Click "Create database"
   - Select "Start in production mode"
   - Choose your region (e.g., europe-west1 for Ireland)

3. **Enable Anonymous Authentication**
   - Click "Authentication" in sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Click "Anonymous" → Enable → Save

4. **Deploy Security Rules**
   - In Firestore Database, click "Rules" tab
   - Replace all content with the rules from `firestore.rules` file
   - Click "Publish"

5. **Get Firebase Configuration**
   - Click the gear icon → Project settings
   - Scroll to "Your apps"
   - Click the Web icon (`</>`)
   - Register app with nickname "October Classic Web"
   - Copy the `firebaseConfig` values

6. **Add Firebase Config to Vercel**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add all the `NEXT_PUBLIC_FIREBASE_*` variables
   - Redeploy (Deployments → ⋯ → Redeploy)

## ✅ Step 5: Initialize Database

1. **Visit Your Deployed App**
   - Go to your Vercel URL (e.g., `october-classic-2025.vercel.app`)

2. **Sign in as Editor**
   - Click "I'm the Scorer"
   - Enter PIN: `0509`

3. **Initialize Database**
   - Click "Initialize Database" button
   - Confirm the action
   - Wait for success message

4. **Verify in Firebase Console**
   - Go to Firestore Database
   - You should see:
     - `events` collection (1 document)
     - `courses` collection (8 documents)
     - `rounds` collection (8 documents)
     - `events/{eventId}/controls/access` document

## 🎯 Step 6: Test Everything

### Test Editor Access
- [ ] PIN entry works
- [ ] Editor lock claimed
- [ ] "Editing" indicator shows
- [ ] Can enter scores
- [ ] "Release Editor" works

### Test Real-time Updates
- [ ] Open app in two browsers
- [ ] Edit scores in one
- [ ] Changes appear in the other within 2 seconds

### Test on Mobile
- [ ] Open on your phone
- [ ] UI is responsive
- [ ] Buttons are tap-friendly
- [ ] Inputs work properly

## 🔄 Future Updates

When you make changes to your code:

```bash
cd "/Users/oisinocarroll/ely-medical/.git/october classic"
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy the changes!

## 🆘 Troubleshooting

### Build Failed on Vercel
**Solution**: Check build logs in Vercel dashboard. Usually means:
- Missing environment variables
- TypeScript errors (run `npm run build` locally to check)

### "Event not found" Error
**Solution**: Initialize the database using the seed button after signing in as editor.

### Firebase Permission Denied
**Solution**: 
- Verify security rules are deployed
- Make sure you're signed in as editor (entered PIN)
- Check Firebase Console → Authentication for anonymous user

### Environment Variables Not Working
**Solution**:
- Ensure variable names are exact (case-sensitive)
- Verify they're set for all three environments
- Redeploy after adding/changing variables

## 📍 Your URLs

After setup, you'll have:

- **GitHub Repository**: `https://github.com/YOUR_USERNAME/october-classic-2025`
- **Vercel Dashboard**: `https://vercel.com/YOUR_USERNAME/october-classic-2025`
- **Live App**: `https://october-classic-2025.vercel.app` (or your custom domain)
- **Firebase Console**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID`

## 🎉 You're Done!

Once you complete these steps:
- ✅ Code is on GitHub
- ✅ App is deployed on Vercel
- ✅ Database is initialized
- ✅ Ready for tournament day!

Share the Vercel URL with tournament participants and the PIN with scorers only.

## 💡 Pro Tips

1. **Custom Domain** (Optional)
   - Vercel Settings → Domains → Add
   - Follow DNS instructions
   - Update Firebase authorized domains

2. **Preview Deployments**
   - Every GitHub push creates a preview
   - Test before it goes to production
   - Merge to main for production deploy

3. **Monitor During Tournament**
   - Keep Vercel Dashboard open
   - Watch Firebase Console → Usage
   - Have backup device ready

4. **Backup Data**
   - After tournament: Firebase Console → Firestore → Export
   - Save for records

---

**Need Help?** Check the other documentation files:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [CHECKLIST.md](./CHECKLIST.md) - Pre-launch checklist

Good luck! 🏌️‍♂️

