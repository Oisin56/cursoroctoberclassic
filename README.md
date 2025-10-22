# The October Classic 2025 - Live Scoring System

A modern, real-time golf scoring application built with Next.js 14, TypeScript, Tailwind CSS, and Firebase. Designed for "The October Classic 2025" golf tournament featuring 8 rounds across iconic Irish courses.

## Features

- **Real-time Updates**: Live scoring with Firestore real-time listeners
- **Editor Lock System**: PIN-protected editor mode with Firebase Anonymous Auth
- **Comprehensive Scoring**: Hole-by-hole tracking for strokeplay, stableford, and matchplay formats
- **Side Games**: Long Drive, Closest to the Pin, Birdies, Eagles, and GIR tracking
- **Cumulative Leaderboard**: Automatic calculation of points across all categories
- **Mobile-First Design**: Dark, sleek, responsive UI optimized for phones and tablets
- **Keyboard Friendly**: Large tap targets and optimized input fields

## Tournament Structure

### Courses
1. **Day 1 AM** - Ballyliffin Old (Strokeplay)
2. **Day 1 PM** - Ballyliffin Glashedy (Strokeplay)
3. **Day 2 AM** - Portsalon (Stableford)
4. **Day 2 PM** - Dunfanaghy (Stableford)
5. **Day 3 AM** - Cruit Island (9 holes, Strokeplay)
6. **Day 3 PM** - Narin & Portnoo (Strokeplay)
7. **Day 4** - Galway Golf Club (Salthill) (Matchplay)
8. **Day 5** - Mount Juliet (Strokeplay)

### Scoring Categories
- **Front 9 Winners**: 3 points each
- **Back 9 Winners**: 3 points each
- **Round Winners**: 10 points each
- **Long Drive**: Points per round (carry-over)
- **Closest to the Pin**: Points per round (carry-over)
- **Birdies**: 1 point each
- **Eagles**: 5 points each
- **GIR Overall Winner**: 10 points (one-time award)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore enabled
- Vercel account (for deployment)

### 1. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose your region

3. Enable **Anonymous Authentication**:
   - Go to Authentication
   - Click "Get started"
   - Enable "Anonymous" sign-in method

4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config values

5. Deploy Firestore Security Rules:
   - Go to Firestore Database → Rules
   - Copy the contents of `firestore.rules` from this repo
   - Publish the rules

### 2. Local Development

1. Clone and install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_EDITOR_PIN=0509
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### 3. Initialize Database

1. Click "I'm the Scorer" button
2. Enter your PIN (default: 0509)
3. Click "Initialize Database" button
4. Confirm the seeding operation

This will create:
- Event document with players
- All 8 courses with hole-by-hole data
- All 8 rounds with formats and side game holes
- Editor access control document

### 4. Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Configure Environment Variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Make sure to add them for Production, Preview, and Development

4. Deploy:
   ```bash
   npm run build
   ```
   - Or click "Deploy" in Vercel dashboard

5. Your app will be live at `your-project.vercel.app`

## Usage

### For Scorers (Editor Mode)

1. Click "I'm the Scorer" button
2. Enter the PIN (shared privately among scorers)
3. You're now in editor mode - all inputs are enabled
4. Navigate between round tabs to enter scores
5. Enter hole-by-hole scores (strokes or points depending on format)
6. Check GIR boxes for greens hit in regulation
7. Enter Long Drive and CTTP points in the side games panel
8. Birdies and Eagles are calculated automatically
9. When done, click "Release Editor" to allow another scorer to take over

### For Viewers

1. Open the app URL - no login required
2. All data updates in real-time as the scorer enters information
3. Switch between round tabs to see individual round details
4. View the Leaderboard tab for overall standings

### Editor Lock Behavior

- Only one person can edit at a time
- The PIN must be correct to claim editor lock
- Editor lock is held until "Release Editor" is clicked or the editor signs out
- If an editor's session expires, the lock is automatically released
- Viewers see live updates but cannot modify any data

## Firestore Data Model

### Collections

**events/{eventId}**
```typescript
{
  name: string
  year: number
  players: string[]
  girOverallWinner: string | null
  createdAt: Timestamp
}
```

**events/{eventId}/controls/access**
```typescript
{
  currentEditorUid: string | null
  updatedAt: Timestamp
}
```

**courses/{courseId}**
```typescript
{
  name: string
  location: string
  holes: Array<{
    number: number
    par: number
    strokeIndex: number
    yardage: number
  }>
}
```

**rounds/{roundId}**
```typescript
{
  eventId: string
  courseId: string
  sequence: number
  label: string
  format: "Strokeplay" | "Stableford" | "Matchplay"
  ldHoles: number[]
  cttpHoles: number[]
}
```

**scores/{scoreId}**
```typescript
{
  roundId: string
  player: string
  holes: {
    [holeNumber: string]: {
      strokes?: number
      points?: number
      gir?: boolean
    }
  }
  birdies: number
  eagles: number
  ldPoints: number
  cttpPoints: number
  updatedAt: Timestamp
}
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Anonymous Auth
- **Hosting**: Vercel
- **UI Components**: Custom components with Lucide icons
- **Notifications**: Sonner toast library

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Main page with tabs and logic
│   └── globals.css         # Global styles and Tailwind
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Tabs.tsx
│   ├── EditorControls.tsx  # Editor lock/unlock buttons
│   ├── EditorPinModal.tsx  # PIN entry modal
│   ├── Leaderboard.tsx     # Cumulative leaderboard
│   └── Scorecard.tsx       # Round scoring interface
├── lib/
│   ├── data/
│   │   ├── courses.ts      # Course hole data
│   │   └── rounds.ts       # Round configurations
│   ├── hooks/
│   │   ├── useEditorLock.ts
│   │   ├── useEvent.ts
│   │   ├── useRounds.ts
│   │   └── useScores.ts
│   ├── firebase.ts         # Firebase initialization
│   ├── seed.ts             # Database seeding utility
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
├── firestore.rules         # Firestore security rules
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Customization

### Changing Players

Edit the player list in the seed function or directly in Firestore:
```typescript
// In lib/seed.ts
await seedDatabase(['Player1', 'Player2', 'Player3', 'Player4']);
```

### Updating Course Data

Edit course information in `lib/data/courses.ts`:
```typescript
{
  id: 'course-id',
  name: 'Course Name',
  location: 'Location',
  holes: [
    { number: 1, par: 4, strokeIndex: 11, yardage: 392 },
    // ... more holes
  ]
}
```

### Modifying Round Formats

Edit round configurations in `lib/data/rounds.ts`:
```typescript
{
  courseId: 'course-id',
  sequence: 1,
  label: 'D1 AM',
  format: 'Strokeplay',
  ldHoles: [4, 18],      // Holes with Long Drive
  cttpHoles: [3, 14],    // Holes with Closest to Pin
}
```

### Changing the PIN

Update the environment variable:
```env
NEXT_PUBLIC_EDITOR_PIN=your-new-pin
```

## Troubleshooting

### "Event not found" on first load
- Click "I'm the Scorer" and enter the PIN
- Click "Initialize Database" to seed the data

### Scores not saving
- Ensure you're in editor mode (signed in with PIN)
- Check browser console for Firebase errors
- Verify Firestore security rules are deployed

### Real-time updates not working
- Check that Firestore is properly configured
- Verify network connectivity
- Check browser console for WebSocket errors

### Authentication issues
- Ensure Anonymous Auth is enabled in Firebase Console
- Check that Firebase config environment variables are correct

## Security Notes

- The PIN is stored in environment variables (client-side visible)
- For production, consider server-side PIN validation
- Firestore rules prevent write access without valid editor lock
- Anonymous auth UIDs are ephemeral and tied to browser session
- Consider implementing more robust authentication for sensitive data

## Support

For issues or questions about The October Classic 2025, contact the tournament organizers.

## License

Private project for The October Classic 2025 golf tournament.

