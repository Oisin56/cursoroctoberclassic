# Deploy Firestore Security Rules

## The Issue
The Par and Stroke Index data isn't saving because the Firestore security rules need to be updated in your Firebase Console.

## Quick Fix (2 minutes)

### Option 1: Via Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/
2. Select your project: **october-classic-2025** (or your project name)
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top
5. **Replace ALL the rules** with the contents of `firestore.rules` file from this project
6. Click **Publish** button

### Option 2: Via Firebase CLI (If you have it installed)

```bash
# If you have firebase-tools installed
firebase deploy --only firestore:rules
```

## What Changed
- Added `exists()` check before `get()` to prevent permission errors
- Added explicit `allow create` permissions for initial seeding
- Fixed courses collection to properly check editor status

## After Deploying Rules
1. Hard refresh your app (Cmd+Shift+R)
2. Try editing Par or Stroke Index again
3. Check the browser console - you should see "Course data updated" messages
4. The changes should now persist in Firestore!

---

**Need help?** The rules file is at: `firestore.rules` in your project root.

