# Pre-Launch Checklist

Use this checklist to verify your October Classic 2025 app is ready to go live.

## Setup Phase

### Firebase Setup
- [ ] Firebase project created
- [ ] Firestore database enabled (production mode)
- [ ] Anonymous Authentication enabled
- [ ] Security rules deployed from `firestore.rules`
- [ ] Firebase config values copied

### Environment Variables
- [ ] `.env.local` created locally
- [ ] All `NEXT_PUBLIC_FIREBASE_*` variables added
- [ ] `NEXT_PUBLIC_EDITOR_PIN` set (default: 0509)
- [ ] Variables added to Vercel dashboard (all environments)

### Local Testing
- [ ] Dependencies installed (`npm install`)
- [ ] App runs locally (`npm run dev`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Firebase connection successful

### Database Initialization
- [ ] Clicked "I'm the Scorer"
- [ ] Entered correct PIN
- [ ] Clicked "Initialize Database"
- [ ] Verified event created in Firestore
- [ ] Verified 8 courses created
- [ ] Verified 8 rounds created
- [ ] Verified editor access control created

## Deployment Phase

### Vercel Setup
- [ ] Project imported to Vercel
- [ ] Environment variables added in Vercel
- [ ] Build completed successfully
- [ ] App accessible at Vercel URL

### Post-Deployment
- [ ] Firebase authorized domains updated (if using custom domain)
- [ ] Shared app URL with scorers
- [ ] Shared PIN privately with scorers
- [ ] Tested on mobile device
- [ ] Tested on tablet
- [ ] Tested on desktop

## Functional Testing

### Editor Access
- [ ] PIN entry works
- [ ] Editor lock claimed successfully
- [ ] "Editing" indicator shows
- [ ] "Release Editor" works
- [ ] Lock released after sign out

### Scorecard Entry
- [ ] Can enter hole scores (strokes/points)
- [ ] Can check GIR boxes
- [ ] Birdies auto-calculate correctly
- [ ] Eagles auto-calculate correctly
- [ ] LD points can be entered
- [ ] CTTP points can be entered
- [ ] Changes save automatically
- [ ] No console errors

### Real-time Updates
- [ ] Open app in two browsers
- [ ] Edit in one browser
- [ ] Changes appear in second browser
- [ ] Updates appear within 1-2 seconds
- [ ] No lag or delays

### Leaderboard
- [ ] All players shown
- [ ] Points calculated correctly
- [ ] Front 9 wins calculated
- [ ] Back 9 wins calculated
- [ ] Round wins calculated
- [ ] LD points shown
- [ ] CTTP points shown
- [ ] Birdies counted
- [ ] Eagles counted (×5)
- [ ] GIR overall winner selection works
- [ ] Total points correct

### All Rounds
- [ ] D1 AM - Ballyliffin Old (Strokeplay)
- [ ] D1 PM - Ballyliffin Glashedy (Strokeplay)
- [ ] D2 AM - Portsalon (Stableford)
- [ ] D2 PM - Dunfanaghy (Stableford)
- [ ] D3 AM - Cruit Island 9-hole (Strokeplay)
- [ ] D3 PM - Narin & Portnoo (Strokeplay)
- [ ] D4 - Galway Golf Club (Matchplay)
- [ ] D5 - Mount Juliet (Strokeplay)

### UI/UX
- [ ] Dark theme displays correctly
- [ ] Text is readable
- [ ] Buttons are tap-friendly (44px min)
- [ ] Inputs work on mobile keyboard
- [ ] Tab navigation works
- [ ] Modal dialogs work
- [ ] Toasts appear for actions
- [ ] No layout shifts
- [ ] Responsive on all screen sizes

## Security Verification

### Firestore Rules
- [ ] Anonymous users can read all data
- [ ] Only editor can write scores
- [ ] Only editor can update rounds
- [ ] Editor lock can be claimed/released
- [ ] Non-editors cannot modify data

### Access Control
- [ ] Wrong PIN rejected
- [ ] Correct PIN accepted
- [ ] Editor status persists across page refresh
- [ ] Multiple editors cannot write simultaneously
- [ ] Viewers cannot edit (inputs disabled)

## Performance Check

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Tab switching < 500ms
- [ ] Score input feels instant
- [ ] Real-time updates < 2 seconds

### Firestore Usage
- [ ] Check Firebase Console > Usage
- [ ] Reads within free tier (< 50K/day)
- [ ] Writes within free tier (< 20K/day)
- [ ] No unexpected spikes

## Pre-Tournament

### Day Before
- [ ] Test full scoring flow with dummy data
- [ ] Verify all courses loaded correctly
- [ ] Share app URL with all participants
- [ ] Share PIN with designated scorers only
- [ ] Test on tournament day devices
- [ ] Ensure scorers have good internet connection
- [ ] Have backup device ready

### Morning Of
- [ ] Verify app is accessible
- [ ] Test editor lock
- [ ] Clear any test data (or re-seed)
- [ ] Confirm Firestore is responding
- [ ] Check Vercel status (no outages)
- [ ] Have Firebase Console open (monitor)

## During Tournament

### Active Monitoring
- [ ] Check Firestore writes succeeding
- [ ] Monitor for any error messages
- [ ] Verify real-time updates working
- [ ] Keep eye on Firestore quota

### Backup Plan
- [ ] Paper scorecards available
- [ ] Spreadsheet backup ready
- [ ] Second device with app loaded
- [ ] Phone hotspot ready if WiFi fails

## Post-Tournament

### Data Preservation
- [ ] Export Firestore data (backup)
- [ ] Screenshot final leaderboard
- [ ] Download any important data
- [ ] Consider keeping database for records

### Review
- [ ] Collect feedback from scorers
- [ ] Note any issues encountered
- [ ] Document any improvements for next year

---

## Quick Fixes

### If Editor Lock Stuck
1. Go to Firebase Console
2. Navigate to Firestore
3. Find `events/october-classic-2025/controls/access`
4. Set `currentEditorUid` to `null`
5. Refresh app

### If Scores Not Saving
1. Check browser console for errors
2. Verify user is signed in (check Network tab)
3. Verify Firestore rules are published
4. Check Firebase Console > Authentication (should see anonymous user)

### If Real-time Updates Stop
1. Refresh the page
2. Check internet connection
3. Check Firebase Console > Usage (not over quota)
4. Sign out and sign back in

---

**Last Updated**: October 2025  
**Version**: 1.0.0

Good luck with The October Classic! 🏌️‍♂️⛳

