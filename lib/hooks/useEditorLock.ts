'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInAnonymously, firebaseSignOut } from '@/lib/firebase';
import { EditorAccess } from '@/lib/types';
import { toast } from 'sonner';

export function useEditorLock(eventId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [editorAccess, setEditorAccess] = useState<EditorAccess | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const accessDocRef = doc(db, 'events', eventId, 'controls', 'access');
    const unsubAccess = onSnapshot(
      accessDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as EditorAccess;
          setEditorAccess(data);
          setIsEditor(
            user !== null && data.currentEditorUid === user.uid
          );
        } else {
          setEditorAccess({ currentEditorUid: null, updatedAt: null as any });
          setIsEditor(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to editor access:', error);
        setLoading(false);
      }
    );

    return () => unsubAccess();
  }, [eventId, user]);

  const claimLock = useCallback(
    async (pin: string) => {
      const expectedPin = process.env.NEXT_PUBLIC_EDITOR_PIN;
      if (pin !== expectedPin) {
        toast.error('Incorrect PIN');
        return false;
      }

      try {
        const userCredential = await signInAnonymously(auth);
        const accessDocRef = doc(db, 'events', eventId, 'controls', 'access');
        await setDoc(accessDocRef, {
          currentEditorUid: userCredential.user.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success('You are now the editor');
        return true;
      } catch (error) {
        console.error('Error claiming lock:', error);
        toast.error('Failed to claim editor lock');
        return false;
      }
    },
    [eventId]
  );

  const releaseLock = useCallback(async () => {
    try {
      const accessDocRef = doc(db, 'events', eventId, 'controls', 'access');
      await setDoc(accessDocRef, {
        currentEditorUid: null,
        updatedAt: serverTimestamp(),
      });
      await firebaseSignOut(auth);
      toast.success('Editor lock released');
    } catch (error) {
      console.error('Error releasing lock:', error);
      toast.error('Failed to release editor lock');
    }
  }, [eventId]);

  return {
    user,
    isEditor,
    editorAccess,
    loading,
    claimLock,
    releaseLock,
  };
}

