import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || isSending || disabled) return;

    try {
      setIsSending(true);
      await onSendMessage(text);
      setText('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-3 bg-white border-t border-gray-200 shrink-0 flex items-end gap-2 pb-safe"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSending}
        placeholder="Message..."
        className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:opacity-50"
        autoComplete="off"
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled || isSending}
        className="p-3 bg-black text-white rounded-full disabled:bg-gray-300 disabled:text-gray-500 transition-colors shrink-0 flex items-center justify-center"
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
