import { useEffect, useCallback } from 'react';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Message } from '../types/message';
import { useAuth } from './useAuth';

export function useMessageStatus(messages: Message[], isVisible: boolean) {
  const { user } = useAuth();

  const updateStatuses = useCallback(async () => {
    if (!user || messages.length === 0) return;

    const batch = writeBatch(db);
    let hasUpdates = false;

    messages.forEach((msg) => {
      if (msg.receiverId !== user.uid) return; // Only update messages received by current user

      const msgRef = doc(db, 'chats', 'mainChat', 'messages', msg.id);
      
      // Update delivered status if it's null
      if (msg.deliveredAt === null) {
        batch.update(msgRef, { deliveredAt: serverTimestamp() });
        hasUpdates = true;
      }

      // Update seen status if visible and currently null
      if (isVisible && msg.seenAt === null) {
        batch.update(msgRef, { seenAt: serverTimestamp() });
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      try {
        await batch.commit();
      } catch (error) {
        console.error("Error updating message statuses:", error);
      }
    }
  }, [messages, user, isVisible]);

  useEffect(() => {
    updateStatuses();
  }, [updateStatuses]);
}
