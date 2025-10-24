import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsEntry } from '@/lib/types';

export function useNews(eventId: string) {
  const [news, setNews] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const newsQuery = query(
      collection(db, 'news'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const newsData: NewsEntry[] = [];
        snapshot.forEach((doc) => {
          newsData.push({ id: doc.id, ...doc.data() } as NewsEntry);
        });
        setNews(newsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching news:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  return { news, loading, error };
}

