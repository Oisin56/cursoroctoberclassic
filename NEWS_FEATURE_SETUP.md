# News & Player Bio Feature Setup Guide

## What's New? 🎉

### 1. **Player Bios Tab**
- Beautiful player profile pages with stats and background
- Content for Neil Hyland and Oisín O'Carroll
- Photo display (needs photos uploaded - see instructions below)

### 2. **News & Updates Section**
- Prominently displayed on home page
- Latest news shown with "Read More" button
- Full news archive accessible
- **Editor-only**: Add, edit, and delete news entries

---

## Setup Steps

### Step 1: Upload Firestore Rules ⚠️ REQUIRED

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database → Rules**
4. Copy the contents of `firestore.rules` from this project
5. Paste and **Publish**

**What this does**: Enables the news collection with proper permissions.

### Step 2: Create Firestore Index (First-time setup)

When you first try to load the app after deploying, you might see an error about a missing index.

**Solution**:
1. Check your browser console for an error message
2. It will contain a direct link to create the index
3. Click the link (it will open Firebase Console)
4. Click **Create Index** button
5. Wait 1-2 minutes for the index to build

**Manual setup** (if no link appears):
1. Go to **Firestore Database → Indexes**
2. Click **Create Index**
3. Collection ID: `news`
4. Add fields:
   - Field: `eventId`, Order: `Ascending`
   - Field: `createdAt`, Order: `Descending`
5. Click **Create**

### Step 3: Upload Player Photos 📸

Player photos are stored in `public/images/`. You need to add:

- **`neil.jpg`** - Photo of Neil Hyland
- **`oisin.jpg`** - Photo of Oisín O'Carroll

**Recommended specs**:
- Square format (800x800px)
- JPG format
- Under 1MB file size

**How to upload**:

#### Option A: Drag & Drop (Easiest)
1. Open `public/images` folder in your file explorer
2. Drag and drop your photos
3. Rename them to exactly `neil.jpg` and `oisin.jpg`
4. Commit and push to GitHub

#### Option B: Terminal
```bash
cp /path/to/neil-photo.jpg public/images/neil.jpg
cp /path/to/oisin-photo.jpg public/images/oisin.jpg

git add public/images/
git commit -m "Add player photos"
git push
```

**Without photos**: The app will display placeholder gradient backgrounds.

---

## How to Use News & Updates

### For Editors:

1. **Log in as Editor**: Click "I'm the Scorer" and enter PIN
2. **Add News**:
   - Scroll to "Manage News & Updates" section (below the news display)
   - Click "Add News" button
   - Enter title (e.g., "Day 1 Preview: Battle at Ballyliffin")
   - Enter body text (supports multi-line)
   - Click "Publish"

3. **Edit News**:
   - Click the ✏️ edit icon next to any news entry
   - Make changes
   - Click "Update"

4. **Delete News**:
   - Click the 🗑️ delete icon
   - Confirm deletion

### For Viewers:

- Latest news appears prominently at the top of the home page
- Click "Read All X Updates" to see full news archive
- News automatically refreshes in real-time

---

## What Players See

### Players Tab
Navigate to the **Players** tab to see:
- Full bios for Neil Hyland and Oisín O'Carroll
- Handicaps, home clubs, favourite colours, animals, golfers
- Background stories and competitive profiles
- Player photos (once uploaded)

### News Section
- Always visible on home page
- Shows latest update with preview
- Click through to read all news entries
- Automatically sorted by date (newest first)

---

## Troubleshooting

### "Failed to save news"
**Solution**: Deploy the updated Firestore rules (see Step 1)

### "The query requires an index"
**Solution**: Follow Step 2 to create the Firestore index

### Photos not showing
**Solution**:
- Check that photos are named exactly `neil.jpg` and `oisin.jpg`
- Ensure they're in the `public/images/` directory
- Commit and push to GitHub
- Wait for Vercel to redeploy (~1-2 minutes)
- Hard refresh browser (Cmd+Shift+R)

### News editor not showing
**Solution**: Make sure you're logged in as the editor (click "I'm the Scorer")

---

## Files Changed

- ✅ `components/PlayerBios.tsx` - Player bio display
- ✅ `components/NewsDisplay.tsx` - News section for homepage
- ✅ `components/NewsEditor.tsx` - Editor interface for managing news
- ✅ `lib/types.ts` - Added `NewsEntry` interface
- ✅ `lib/hooks/useNews.ts` - React hook for fetching news
- ✅ `app/page.tsx` - Integrated Players tab and news section
- ✅ `firestore.rules` - Added news collection rules
- ✅ `public/images/` - Directory for player photos (needs photos)

---

**Ready to go!** Follow the 3 setup steps above and you're all set. 🎉

