# Quick Start Guide

Get The October Classic 2025 scoring app running in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup (5 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project or select existing
3. **Enable Firestore**: Database → Create database → Production mode
4. **Enable Anonymous Auth**: Authentication → Sign-in method → Enable Anonymous
5. **Get Config**: Project Settings → Your apps → Web app → Copy config

## 3. Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_EDITOR_PIN=0509
```

## 4. Deploy Firestore Rules

1. Firebase Console → Firestore → Rules
2. Copy contents from `firestore.rules`
3. Paste and click "Publish"

## 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 6. Initialize Database

1. Click "I'm the Scorer"
2. Enter PIN: `0509`
3. Click "Initialize Database"
4. Done! Start scoring 🏌️

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add the same environment variables in Vercel dashboard.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Default Players

- Oisin
- Neil
- Brendan
- Stevie

To change players, edit `lib/seed.ts` before running "Initialize Database".

## Need Help?

- See [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review `firestore.rules` for security rules explanation

