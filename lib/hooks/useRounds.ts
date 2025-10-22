'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Round, Course } from '@/lib/types';

export function useRounds(eventId: string) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const roundsQuery = query(
      collection(db, 'rounds'),
      where('eventId', '==', eventId),
      orderBy('sequence', 'asc')
    );

    const unsubscribe = onSnapshot(
      roundsQuery,
      async (snapshot) => {
        const roundsData: Round[] = [];
        
        for (const docSnap of snapshot.docs) {
          const roundData = { id: docSnap.id, ...docSnap.data() } as Round;
          
          // Fetch course data
          if (roundData.courseId) {
            try {
              const courseDoc = await getDoc(doc(db, 'courses', roundData.courseId));
              if (courseDoc.exists()) {
                roundData.course = { id: courseDoc.id, ...courseDoc.data() } as Course;
              }
            } catch (err) {
              console.error('Error fetching course:', err);
            }
          }
          
          roundsData.push(roundData);
        }
        
        setRounds(roundsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching rounds:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  return { rounds, loading, error };
}

