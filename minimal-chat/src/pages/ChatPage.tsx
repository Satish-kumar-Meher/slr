import React from 'react';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { useMessages } from '../hooks/useMessages';
import { usePresence } from '../hooks/usePresence';

export const ChatPage: React.FC = () => {
  const { messages, loading, sendMessage, clearChat } = useMessages();
  const { partnerPresence } = usePresence();

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center h-[100dvh] bg-gray-100">
      <div className="w-full max-w-2xl bg-white h-[100dvh] flex flex-col shadow-sm">
        <ChatHeader partnerPresence={partnerPresence} onClearChat={clearChat} />
        <MessageList messages={messages} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};
