'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Score } from '@/lib/types';

export function useScores(roundId: string) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roundId) {
      setScores([]);
      setLoading(false);
      return;
    }

    const scoresQuery = query(
      collection(db, 'scores'),
      where('roundId', '==', roundId)
    );

    const unsubscribe = onSnapshot(
      scoresQuery,
      (snapshot) => {
        const scoresData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Score[];
        
        setScores(scoresData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching scores:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roundId]);

  return { scores, loading, error };
}

