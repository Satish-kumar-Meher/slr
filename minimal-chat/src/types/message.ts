import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Timestamp | null; // null briefly before server Timestamp resolves
  deliveredAt: Timestamp | null;
  seenAt: Timestamp | null;
  isPending?: boolean;
}
