import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '../types/message';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';
import { useAuth } from '../hooks/useAuth';
import { useMessageStatus } from '../hooks/useMessageStatus';
import { ArrowDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(document.visibilityState === 'visible');

  // Track document visibility for 'seen' status
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Use our custom hook to mark messages as delivered/seen
  useMessageStatus(messages, isDocumentVisible);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Show button if we are more than 100px from bottom
    setShowScrollButton(distanceFromBottom > 100);
  };

  // Initial scroll and auto-scroll on new message if already near bottom
  useEffect(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // If we're within 200px of bottom, auto-scroll to new message
    if (distanceFromBottom < 200) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages: { date: Date; messages: Message[] }[] = [];
  let currentDateStr = '';

  messages.forEach((msg) => {
    const msgDate = msg.createdAt ? msg.createdAt.toDate() : new Date();
    const dateStr = msgDate.toDateString();
    
    if (dateStr !== currentDateStr) {
      groupedMessages.push({ date: msgDate, messages: [msg] });
      currentDateStr = dateStr;
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  return (
    <div 
      className="flex-1 overflow-y-auto px-4 py-6 bg-white relative" 
      ref={containerRef}
      onScroll={handleScroll}
    >
      {groupedMessages.map((group) => (
        <React.Fragment key={group.date.toISOString()}>
          <DateSeparator date={group.date} />
          {group.messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.senderId === user?.uid} 
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={bottomRef} className="h-1" />
      
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
