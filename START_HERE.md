# 🏌️ The October Classic 2025 - START HERE

Your complete golf scoring system is ready! This guide will get you up and running in minutes.

## 📋 What You Have

A professional, real-time golf scoring application with:

✅ **8 Complete Rounds** - All Irish courses configured with hole data  
✅ **Live Scoring** - Real-time updates for all viewers  
✅ **Side Games** - LD, CTTP, Birdies, Eagles, GIR tracking  
✅ **Cumulative Leaderboard** - Automatic points calculation  
✅ **Mobile-First** - Optimized for phones and tablets  
✅ **Secure** - PIN-protected editor with Firebase authentication  

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Firebase Setup
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project (or use existing)
3. Enable **Firestore Database** (production mode)
4. Enable **Anonymous Authentication**
5. Copy your Firebase config

### Step 3: Environment Variables
Create `.env.local` in this directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_EDITOR_PIN=0509
```

### Step 4: Deploy Firestore Rules
1. Firebase Console → Firestore → Rules
2. Copy contents from `firestore.rules`
3. Paste and click "Publish"

### Step 5: Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Step 6: Initialize Database
1. Click "I'm the Scorer"
2. Enter PIN: `0509`
3. Click "Initialize Database"
4. Confirm to create all courses and rounds

🎉 **Done!** Start entering scores.

## 📱 How to Use

### For Scorers
1. Click "I'm the Scorer" button
2. Enter PIN (shared privately)
3. Navigate to round tabs
4. Enter scores hole-by-hole
5. Check GIR boxes as needed
6. Enter LD/CTTP points
7. Click "Release Editor" when done

### For Viewers
1. Just open the URL
2. Watch scores update live
3. No login needed

## 🌐 Deploy to Vercel (5 Minutes)

### Option 1: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this project
3. Add all environment variables
4. Click Deploy

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

After deployment, add environment variables in Vercel dashboard.

## 📚 Documentation

- **[README.md](./README.md)** - Complete feature documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Ultra-fast setup
- **[CHECKLIST.md](./CHECKLIST.md)** - Pre-launch verification
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview

## 🎯 Tournament Courses

All configured with Par, Stroke Index, and Yardage:

1. **Day 1 AM** - Ballyliffin Old (Strokeplay)
2. **Day 1 PM** - Ballyliffin Glashedy (Strokeplay)
3. **Day 2 AM** - Portsalon (Stableford)
4. **Day 2 PM** - Dunfanaghy (Stableford)
5. **Day 3 AM** - Cruit Island - 9 holes (Strokeplay)
6. **Day 3 PM** - Narin & Portnoo (Strokeplay)
7. **Day 4** - Galway Golf Club, Salthill (Matchplay)
8. **Day 5** - Mount Juliet (Strokeplay)

## 🏆 Scoring System

Points are awarded for:
- **Front 9 Wins**: 3 points each round
- **Back 9 Wins**: 3 points each round
- **Round Wins**: 10 points each
- **Long Drive**: Points per round (you enter totals)
- **Closest to Pin**: Points per round (you enter totals)
- **Birdies**: 1 point each (auto-calculated)
- **Eagles**: 5 points each (auto-calculated)
- **GIR Overall Winner**: 10 points (one-time award)

## 🔧 Customization

### Change Players
Edit before initializing database:
```typescript
// In lib/seed.ts, line 11
await seedDatabase(['Oisin', 'Neil', 'Brendan', 'Stevie']);
```

### Change PIN
Update in `.env.local`:
```env
NEXT_PUBLIC_EDITOR_PIN=your-new-pin
```

### Update Course Data
Edit hole information in `lib/data/courses.ts`

## ⚡ Key Features

### Real-time Updates
- All connected devices see changes instantly
- Uses Firebase Firestore listeners
- Updates typically within 500ms

### Editor Lock System
- Only one person can score at a time
- PIN-protected access
- "Release Editor" for handoff
- Prevents conflicting updates

### Auto-calculations
- Birdies and Eagles calculated from scores
- Front/Back 9 winners determined automatically
- Round winners by format type
- Leaderboard totals updated live

### Mobile Optimized
- Large tap targets (44px minimum)
- Dark theme for outdoor visibility
- Numeric keyboards for score entry
- Responsive layout for all devices

## 🐛 Troubleshooting

### "Event not found"
→ Initialize database using the seed button

### Scores not saving
→ Make sure you're signed in as editor (entered PIN)

### Real-time not working
→ Check internet connection and Firebase quota

### Editor lock stuck
→ Go to Firebase Console, set `currentEditorUid` to `null`

See [CHECKLIST.md](./CHECKLIST.md) for full troubleshooting guide.

## 📊 Project Structure

```
october-classic-2025/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── Scorecard.tsx      # Main scoring interface
│   └── Leaderboard.tsx    # Points leaderboard
├── lib/
│   ├── data/              # Course and round data
│   ├── hooks/             # Custom React hooks
│   ├── firebase.ts        # Firebase config
│   └── seed.ts            # Database initialization
├── firestore.rules        # Security rules
└── *.md                   # Documentation
```

## 💰 Cost

**Free Tier Limits:**
- Firebase: 50K reads, 20K writes/day
- Vercel: 100GB bandwidth/month

**Estimated Usage:**
- ~5,000 reads/day (viewers checking scores)
- ~500 writes/day (score updates)

✅ **Well within free tier for private tournament**

## 🔒 Security

- Firestore rules prevent unauthorized writes
- PIN verification before editor access
- Anonymous auth for session management
- Read-only for all non-editors

## 📞 Need Help?

1. Check the [README.md](./README.md) troubleshooting section
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for setup issues
3. Use [CHECKLIST.md](./CHECKLIST.md) to verify everything

## ✨ Features Highlight

### Scorecard
- Hole-by-hole entry for strokes or points
- GIR checkbox per hole
- LD and CTTP indicators on specific holes
- Side games panel for bonus points
- Auto-calculated birdies/eagles
- Debounced auto-save (300ms)

### Leaderboard
- Live position updates
- Color-coded top 3
- Trophy icons for winners
- Points breakdown by category
- GIR overall winner selector

### Editor Experience
- PIN modal for access
- Visual "Editing" indicator
- Release button for handoff
- All inputs enabled when editing
- Disabled inputs for viewers

## 🎬 Ready to Go!

Your app is fully configured and ready to deploy. Follow the Quick Start above and you'll be scoring in minutes.

**Default PIN**: `0509` (change in environment variables)

**Default Players**: Oisin, Neil, Brendan, Stevie (change in `lib/seed.ts`)

Good luck with The October Classic 2025! 🏌️‍♂️⛳

---

**Built with**: Next.js 14, TypeScript, Tailwind CSS, Firebase  
**Deployed on**: Vercel  
**Version**: 1.0.0  
**Date**: October 2025

