/**
 * Migration Script: Preserve Day 1 AM and Day 1 PM Data During Reseed
 * 
 * This script will:
 * 1. Export existing Day 1 AM and Day 1 PM data to backup files
 * 2. Guide you to reseed the database
 * 3. Restore the Day 1 data to the new database structure
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase configuration (update with your credentials)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const EVENT_ID = 'october-classic-2025';

interface BackupData {
  rounds: any[];
  scores: any[];
  courses: any[];
  timestamp: string;
}

// Step 1: Export Day 1 data
async function exportDay1Data(): Promise<BackupData> {
  console.log('📦 Exporting Day 1 AM and Day 1 PM data...\n');

  const backupData: BackupData = {
    rounds: [],
    scores: [],
    courses: [],
    timestamp: new Date().toISOString(),
  };

  try {
    // Get rounds with old labels (D1 AM, D1 PM)
    const roundsQuery = query(
      collection(db, 'rounds'),
      where('eventId', '==', EVENT_ID)
    );
    const roundsSnapshot = await getDocs(roundsQuery);
    
    const day1RoundIds: string[] = [];

    for (const docSnap of roundsSnapshot.docs) {
      const roundData = { id: docSnap.id, ...docSnap.data() } as any;
      
      // Look for D1 AM or D1 PM (old labels)
      if (roundData.label === 'D1 AM' || roundData.label === 'D1 PM') {
        console.log(`✓ Found round: ${roundData.label} (${roundData.course?.name || 'Unknown Course'})`);
        backupData.rounds.push(roundData);
        day1RoundIds.push(docSnap.id);
      }
    }

    if (day1RoundIds.length === 0) {
      console.log('⚠️  No Day 1 rounds found. They may already be deleted or use different labels.');
      return backupData;
    }

    // Get all scores for Day 1 rounds
    console.log('\n📊 Exporting scores...');
    const scoresSnapshot = await getDocs(collection(db, 'scores'));
    
    for (const docSnap of scoresSnapshot.docs) {
      const scoreData = { id: docSnap.id, ...docSnap.data() } as any;
      
      if (day1RoundIds.includes(scoreData.roundId)) {
        console.log(`✓ Found score: ${scoreData.player} - Round ${scoreData.roundId.substring(0, 8)}...`);
        backupData.scores.push(scoreData);
      }
    }

    // Get course data for the courses used in Day 1
    console.log('\n🏌️  Exporting course data...');
    for (const round of backupData.rounds) {
      if (round.courseId) {
        const courseSnapshot = await getDocs(
          query(collection(db, 'courses'), where('__name__', '==', round.courseId))
        );
        
        courseSnapshot.forEach(docSnap => {
          const courseData = { id: docSnap.id, ...docSnap.data() } as any;
          console.log(`✓ Found course: ${courseData.name}`);
          backupData.courses.push(courseData);
        });
      }
    }

    // Save to file
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const backupPath = path.join(BACKUP_DIR, `day1-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    console.log(`\n✅ Backup complete! Saved to: ${backupPath}`);
    console.log(`\n📋 Summary:`);
    console.log(`   - Rounds: ${backupData.rounds.length}`);
    console.log(`   - Scores: ${backupData.scores.length}`);
    console.log(`   - Courses: ${backupData.courses.length}`);

    return backupData;

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

// Step 2: Import Day 1 data after reseed
async function importDay1Data(backupData: BackupData): Promise<void> {
  console.log('\n📥 Restoring Day 1 data to new database...\n');

  try {
    // First, restore course data (if needed)
    for (const course of backupData.courses) {
      const courseRef = doc(db, 'courses', course.id);
      const { id, ...courseData } = course;
      await setDoc(courseRef, courseData, { merge: true });
      console.log(`✓ Restored course: ${courseData.name}`);
    }

    // Get the new Day 1 round IDs (with new labels: "Day 1 AM", "Day 1 PM")
    const newRoundsQuery = query(
      collection(db, 'rounds'),
      where('eventId', '==', EVENT_ID)
    );
    const newRoundsSnapshot = await getDocs(newRoundsQuery);
    
    const labelMapping: Record<string, string> = {};

    newRoundsSnapshot.forEach(docSnap => {
      const roundData = docSnap.data() as any;
      
      // Map old labels to new round IDs
      if (roundData.label === 'Day 1 AM') {
        labelMapping['D1 AM'] = docSnap.id;
      } else if (roundData.label === 'Day 1 PM') {
        labelMapping['D1 PM'] = docSnap.id;
      }
    });

    console.log(`\n🔗 Round mapping:`);
    console.log(`   D1 AM → Day 1 AM (${labelMapping['D1 AM']?.substring(0, 8)}...)`);
    console.log(`   D1 PM → Day 1 PM (${labelMapping['D1 PM']?.substring(0, 8)}...)`);

    // Restore scores with updated round IDs
    console.log('\n📊 Restoring scores...');
    for (const score of backupData.scores) {
      const oldRound = backupData.rounds.find(r => r.id === score.roundId);
      if (!oldRound) continue;

      const newRoundId = labelMapping[oldRound.label];
      if (!newRoundId) {
        console.log(`⚠️  Skipping score for ${score.player} - no matching new round found`);
        continue;
      }

      const newScoreRef = doc(db, 'scores', score.id);
      const { id, updatedAt, ...scoreData } = score;
      
      await setDoc(newScoreRef, {
        ...scoreData,
        roundId: newRoundId,
        updatedAt: serverTimestamp(),
      });

      console.log(`✓ Restored score: ${score.player} - ${oldRound.label}`);
    }

    console.log('\n✅ Day 1 data successfully restored!');

  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   Day 1 Data Migration Tool');
  console.log('═══════════════════════════════════════════════════════\n');

  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'export') {
    await exportDay1Data();
    console.log('\n📝 Next steps:');
    console.log('   1. Go to your app');
    console.log('   2. Click "I\'m the Scorer" and enter PIN');
    console.log('   3. Click "Clear All & Re-seed" button');
    console.log('   4. Run: npm run migrate:import\n');

  } else if (command === 'import') {
    // Find the most recent backup file
    const backupFiles = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('day1-backup-'))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      console.log('❌ No backup file found. Run "npm run migrate:export" first.');
      return;
    }

    const latestBackup = path.join(BACKUP_DIR, backupFiles[0]);
    console.log(`📂 Loading backup: ${backupFiles[0]}\n`);

    const backupData = JSON.parse(fs.readFileSync(latestBackup, 'utf-8'));
    await importDay1Data(backupData);

  } else {
    console.log('Usage:');
    console.log('  npm run migrate:export  - Export Day 1 data before reseed');
    console.log('  npm run migrate:import  - Import Day 1 data after reseed\n');
  }
}

main().catch(console.error);

