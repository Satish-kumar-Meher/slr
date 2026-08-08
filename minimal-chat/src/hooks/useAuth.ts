import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, AUTHORIZED_UIDS, SPOTIFY_REDIRECT_USER } from '../firebase/firebase';
import type { User } from '../types/user';
import { useNavigate } from 'react-router-dom';

const SPOTIFY_REDIRECT_KEY = 'spotifyRedirectPending';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const isSpotifyRedirectUser =
          firebaseUser.uid === SPOTIFY_REDIRECT_USER.uid &&
          firebaseUser.email?.toLowerCase() === SPOTIFY_REDIRECT_USER.email;

        if (isSpotifyRedirectUser) {
          try {
            await auth.signOut();
          } catch {
            // if sign-out fails, still redirect externally
          }
          sessionStorage.setItem(SPOTIFY_REDIRECT_KEY, '1');
          window.location.href = SPOTIFY_REDIRECT_USER.url;
          return;
        }

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
  }, [navigate]);

  return { user, loading, error };
}
