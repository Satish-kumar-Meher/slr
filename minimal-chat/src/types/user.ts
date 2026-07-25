export interface UserPresence {
  online: boolean;
  lastSeen: number | null;
}

export interface User {
  uid: string;
  email: string | null;
}
