import { doc, setDoc, collection, serverTimestamp, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { coursesData } from './data/courses';
import { roundsData } from './data/rounds';

const EVENT_ID = 'october-classic-2025';

export async function seedDatabase(players: string[] = ['Oisin', 'Neil']) {
  try {
    // FIRST: Clear all existing data
    const batch = writeBatch(db);
    
    // Delete all scores
    const scoresSnapshot = await getDocs(collection(db, 'scores'));
    scoresSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete all rounds
    const roundsSnapshot = await getDocs(collection(db, 'rounds'));
    roundsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete all courses
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    coursesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Commit deletions
    await batch.commit();

    // NOW: Create fresh data
    // Create event
    const eventRef = doc(db, 'events', EVENT_ID);
    await setDoc(eventRef, {
      name: 'The October Classic 2025',
      year: 2025,
      players,
      girOverallWinner: null,
      createdAt: serverTimestamp(),
    });

    // Create editor access control
    const accessRef = doc(db, 'events', EVENT_ID, 'controls', 'access');
    await setDoc(accessRef, {
      currentEditorUid: null,
      updatedAt: serverTimestamp(),
    });

    // Create courses with blank hole data
    for (const course of coursesData) {
      const courseRef = doc(db, 'courses', course.id);
      console.log('Seeding course:', course.id, 'with', course.holes.length, 'blank holes');
      await setDoc(courseRef, {
        name: course.name,
        location: course.location,
        holes: course.holes,
      });
    }
    console.log('All courses seeded with blank hole data (no par/SI)');

    // Create rounds
    for (const round of roundsData) {
      const roundRef = doc(collection(db, 'rounds'));
      await setDoc(roundRef, {
        ...round,
        eventId: EVENT_ID,
        submitted: false,
      });
    }

    return { success: true, message: 'Database cleared and reseeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database', error };
  }
}

