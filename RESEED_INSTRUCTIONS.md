# ⚠️ Important: You Need to Reseed Your Database

## Why You're Still Seeing Old Data

The code changes have been made, but your **Firestore database still has the old tournament data**. 

What you're seeing:
- ❌ D4 (Galway) still showing
- ❌ D2 PM showing as Stableford (should be Matchplay)
- ❌ Tabs showing "D1 AM" instead of "Day 1 AM"

## Quick Fix (Takes 30 seconds)

### Step 1: Open Your App
Go to your deployed app (or localhost if testing locally)

### Step 2: Become the Editor
1. Click **"I'm the Scorer"** button
2. Enter your PIN
3. You should see "Editing as {your-uid}"

### Step 3: Click "Clear All & Re-seed"
1. Look in the **bottom-right corner** of the screen
2. You'll see a button: **"Clear All & Re-seed"**
3. Click it
4. Confirm the action

### Step 4: Refresh
After seeding completes (you'll see a success message):
1. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check the tabs

## What Will Change:

✅ **D4 (Galway)** - REMOVED (no longer shows)  
✅ **Day 2 PM (Dunfanaghy)** - Now shows as **Matchplay**  
✅ **Tab Labels** - Now show "Day 1 AM", "Day 1 PM", "Day 2 AM", etc.  
✅ **Mt Juliet** - Moved to Day 4  

## New Tournament Schedule After Reseeding:

| Tab Label | Course | Format |
|-----------|--------|--------|
| Day 1 AM | Ballyliffin Old | Strokeplay |
| Day 1 PM | Ballyliffin Glashedy | Strokeplay |
| Day 2 AM | Portsalon | Stableford |
| **Day 2 PM** | **Dunfanaghy** | **Matchplay** |
| Day 3 AM | Cruit Island | Strokeplay |
| Day 3 PM | Narin & Portnoo | Strokeplay |
| Day 4 | Mount Juliet | Strokeplay |

**Total: 7 rounds over 4 days**

---

## Why This Happens

When you change code in `lib/data/rounds.ts`, it only affects **new** database seeds. Your existing Firestore database keeps its old data until you reseed.

Think of it like:
- **Code** = the blueprint 📝
- **Database** = the actual building 🏗️
- **Reseeding** = demolishing and rebuilding from the new blueprint 🔨

---

## Important Notes

⚠️ **This will clear ALL existing data including:**
- Scores you've entered
- Course hole data (Par/SI)
- Submitted rounds

If you've already entered important data, let me know and I can help you migrate it instead of reseeding.

---

**After reseeding, everything will match the new schedule!** 🎉

