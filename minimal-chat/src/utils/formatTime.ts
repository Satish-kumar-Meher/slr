import { Timestamp } from 'firebase/firestore';

export function formatTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
