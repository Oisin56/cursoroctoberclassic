# 🔄 Day 1 Data Migration Guide

This guide will help you preserve your Day 1 AM and Day 1 PM data while reseeding the database with the new tournament schedule.

## What Changed

✅ **Mount Juliet** - Changed from Strokeplay to **Stableford**  
✅ **Tab Labels** - Changed to "Day 1 AM", "Day 1 PM", etc.  
✅ **D4 (Galway)** - Removed from tournament  
✅ **Day 2 PM** - Changed to **Matchplay**  

## Step-by-Step Migration

### Step 1: Install Dependencies

```bash
npm install
```

This installs `tsx` which is needed to run the migration script.

### Step 2: Create .env.local File

If you haven't already, create a `.env.local` file in the project root with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_EDITOR_PIN=your_pin
```

### Step 3: Export Day 1 Data

Run this command to backup your Day 1 AM and Day 1 PM data:

```bash
npm run migrate:export
```

You should see:
```
✓ Found round: D1 AM (Ballyliffin Old)
✓ Found round: D1 PM (Ballyliffin Glashedy)
✓ Found score: Oisin - Round ...
✓ Found score: Neil - Round ...
✅ Backup complete! Saved to: backups/day1-backup-xxxxx.json
```

The backup file is saved in the `backups/` folder.

### Step 4: Reseed the Database

Now go to your app:

1. Open your app in the browser
2. Click **"I'm the Scorer"** and enter your PIN
3. Scroll to the bottom-right corner
4. Click **"Clear All & Re-seed"** button
5. Confirm the action
6. Wait for success message

### Step 5: Restore Day 1 Data

After reseeding completes, run:

```bash
npm run migrate:import
```

You should see:
```
✓ Restored course: Ballyliffin Old
✓ Restored course: Ballyliffin Glashedy
✓ Restored score: Oisin - D1 AM
✓ Restored score: Neil - D1 AM
✓ Restored score: Oisin - D1 PM
✓ Restored score: Neil - D1 PM
✅ Day 1 data successfully restored!
```

### Step 6: Verify

1. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check the tabs - you should see:
   - ✅ Day 1 AM (with your data preserved)
   - ✅ Day 1 PM (with your data preserved)
   - ✅ Day 2 AM
   - ✅ Day 2 PM (Matchplay)
   - ✅ Day 3 AM
   - ✅ Day 3 PM
   - ✅ Day 4 (Mount Juliet - Stableford)
   - ❌ No D4 (Galway) - correctly removed

---

## New Tournament Schedule

| Tab | Course | Format | Date |
|-----|--------|--------|------|
| Day 1 AM | Ballyliffin Old | Strokeplay | Oct 23 |
| Day 1 PM | Ballyliffin Glashedy | Strokeplay | Oct 23 |
| Day 2 AM | Portsalon | Stableford | Oct 24 |
| **Day 2 PM** | **Dunfanaghy** | **Matchplay** | **Oct 24** |
| Day 3 AM | Cruit Island | Strokeplay | Oct 25 |
| Day 3 PM | Narin & Portnoo | Strokeplay | Oct 25 |
| **Day 4** | **Mount Juliet** | **Stableford** | **Oct 26** |

**Total: 7 rounds over 4 days**

---

## Troubleshooting

### "No backup file found"
- Make sure you ran `npm run migrate:export` first
- Check the `backups/` folder exists

### "No Day 1 rounds found"
- Your database might already be reseeded
- Check if your rounds have labels "D1 AM" and "D1 PM" (old) or "Day 1 AM" and "Day 1 PM" (new)

### Firebase connection errors
- Make sure your `.env.local` file has the correct Firebase credentials
- Check that your Firebase project allows connections from your IP

---

## What Gets Preserved

✅ **Day 1 AM scores** - All player scores, handicaps, hole-by-hole data  
✅ **Day 1 PM scores** - All player scores, handicaps, hole-by-hole data  
✅ **Course data** - Par, Stroke Index, LD/CP selections  
✅ **Side games** - LD, CTTP points  
✅ **Birdies/Eagles** - Counts preserved  

## What Gets Reset

⚠️ **All other rounds** - Day 2-4 will be blank and ready for new data  
⚠️ **Leaderboard** - Will recalculate based only on Day 1 data  

---

**Ready?** Follow the steps above and your Day 1 data will be safe! 🎉

