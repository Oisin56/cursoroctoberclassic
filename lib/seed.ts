import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { coursesData } from './data/courses';
import { roundsData } from './data/rounds';

const EVENT_ID = 'october-classic-2025';

export async function seedDatabase(players: string[]) {
  try {
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

    // Create courses
    for (const course of coursesData) {
      const courseRef = doc(db, 'courses', course.id);
      await setDoc(courseRef, {
        name: course.name,
        location: course.location,
        holes: course.holes,
      });
    }

    // Create rounds
    for (const round of roundsData) {
      const roundRef = doc(collection(db, 'rounds'));
      await setDoc(roundRef, {
        ...round,
        eventId: EVENT_ID,
      });
    }

    // Create initial empty scores for each round and player
    // We'll do this on-demand in the UI instead to keep it lightweight

    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database', error };
  }
}

