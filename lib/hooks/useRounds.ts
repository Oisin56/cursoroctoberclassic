'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
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

    const courseUnsubscribers: (() => void)[] = [];

    const unsubscribeRounds = onSnapshot(
      roundsQuery,
      (snapshot) => {
        // Clear previous course listeners
        courseUnsubscribers.forEach(unsub => unsub());
        courseUnsubscribers.length = 0;

        const roundsData: Round[] = [];
        
        snapshot.docs.forEach((docSnap) => {
          const roundData = { id: docSnap.id, ...docSnap.data() } as Round;
          roundsData.push(roundData);
          
          // Set up real-time listener for course data
          if (roundData.courseId) {
            const courseRef = doc(db, 'courses', roundData.courseId);
            const unsubCourse = onSnapshot(
              courseRef,
              (courseDoc) => {
                if (courseDoc.exists()) {
                  const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
                  console.log('🔄 Course data updated in real-time:', courseData.name);
                  // Update the specific round's course data
                  setRounds(prev => prev.map(r => 
                    r.id === roundData.id 
                      ? { ...r, course: courseData }
                      : r
                  ));
                }
              },
              (err) => {
                console.error('Error fetching course:', err);
              }
            );
            courseUnsubscribers.push(unsubCourse);
          }
        });
        
        setRounds(roundsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching rounds:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeRounds();
      courseUnsubscribers.forEach(unsub => unsub());
    };
  }, [eventId]);

  return { rounds, loading, error };
}

