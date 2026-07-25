import React, { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import { auth } from '../firebase/firebase';
import type { UserPresence } from '../types/user';
import { formatLastSeen } from '../utils/formatLastSeen';

interface ChatHeaderProps {
  partnerPresence: UserPresence | null;
  onClearChat: () => Promise<void>;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ partnerPresence, onClearChat }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to delete all messages?')) {
      setIsClearing(true);
      try {
        await onClearChat();
      } catch (error) {
        console.error('Failed to clear chat:', error);
      } finally {
        setIsClearing(false);
      }
    }
  };

  const getStatusDisplay = () => {
    if (!partnerPresence) return 'Connecting...';
    if (partnerPresence.online) return '● Online';
    return formatLastSeen(partnerPresence.lastSeen);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900">Partner</h1>
        <span className={`text-sm ${partnerPresence?.online ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
          {getStatusDisplay()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleClearChat}
          disabled={isClearing}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
          aria-label="Clear Chat"
          title="Delete all messages"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
