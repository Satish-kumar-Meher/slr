import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, AUTHORIZED_UIDS } from '../firebase/firebase';
import type { User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        if (AUTHORIZED_UIDS.includes(firebaseUser.uid)) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
          setError(null);
        } else {
          // Log out unauthorized users immediately
          auth.signOut();
          setUser(null);
          setError('Unauthorized account.');
        }
      } else {
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}
