import { useEffect, useState } from 'react';
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { rtdb, AUTHORIZED_UIDS } from '../firebase/firebase';
import { useAuth } from './useAuth';
import type { UserPresence } from '../types/user';

export function usePresence() {
  const { user } = useAuth();
  const [partnerPresence, setPartnerPresence] = useState<UserPresence | null>(null);

  useEffect(() => {
    if (!user) return;

    // Track own presence
    const userStatusRef = ref(rtdb, `presence/${user.uid}`);
    const connectedRef = ref(rtdb, '.info/connected');

    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        const disconnectRef = onDisconnect(userStatusRef);
        
        disconnectRef.set({
          online: false,
          lastSeen: serverTimestamp(),
        }).then(() => {
          set(userStatusRef, {
            online: true,
            lastSeen: serverTimestamp(),
          });
        });
      }
    });

    // Watch partner presence
    const partnerId = AUTHORIZED_UIDS.find(uid => uid !== user.uid);
    let unsubscribePartner: () => void = () => {};

    if (partnerId) {
      const partnerStatusRef = ref(rtdb, `presence/${partnerId}`);
      unsubscribePartner = onValue(partnerStatusRef, (snap) => {
        if (snap.exists()) {
          setPartnerPresence(snap.val() as UserPresence);
        } else {
          setPartnerPresence(null);
        }
      });
    }

    return () => {
      unsubscribeConnected();
      unsubscribePartner();
    };
  }, [user]);

  return { partnerPresence };
}
