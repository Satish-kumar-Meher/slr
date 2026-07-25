import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Message } from '../types/message';
import { useAuth } from './useAuth';
import { AUTHORIZED_UIDS } from '../firebase/firebase';

const CHAT_ID = 'mainChat';
const INITIAL_MESSAGE_LIMIT = 50;

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'chats', CHAT_ID, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(INITIAL_MESSAGE_LIMIT));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: Message[] = [];
        snapshot.forEach((doc) => {
          newMessages.push({ 
            id: doc.id, 
            ...doc.data({ serverTimestamps: 'estimate' }),
            isPending: doc.metadata.hasPendingWrites
          } as Message);
        });
        
        // Reverse because we queried descending to get latest, but want to display ascending chronologically
        setMessages(newMessages.reverse());
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user) return;
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Determine receiver ID (the other authorized UID)
    const receiverId = AUTHORIZED_UIDS.find((uid) => uid !== user.uid) || '';
    if (!receiverId) {
      console.error('Could not determine receiverId');
      return;
    }

    try {
      const messagesRef = collection(db, 'chats', CHAT_ID, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        receiverId,
        text: trimmedText,
        createdAt: serverTimestamp(),
        deliveredAt: null,
        seenAt: null
      });
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [user]);

  const clearChat = useCallback(async () => {
    if (!user) return;
    try {
      const messagesRef = collection(db, 'chats', CHAT_ID, 'messages');
      const q = query(messagesRef);
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (err) {
      console.error('Error clearing chat:', err);
      throw err;
    }
  }, [user]);

  return { messages, loading, error, sendMessage, clearChat };
}
