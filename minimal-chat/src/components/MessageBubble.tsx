import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { Message } from '../types/message';
import { formatTime } from '../utils/formatTime';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={clsx("flex flex-col mb-4", isOwn ? "items-end" : "items-start")}>
      <div 
        className={clsx(
          "max-w-[75%] px-4 py-2 rounded-2xl relative",
          isOwn ? "bg-black text-white rounded-tr-sm" : "bg-gray-100 text-gray-900 rounded-tl-sm"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
        <span>{formatTime(message.createdAt)}</span>
        {isOwn && (
          <div className="flex items-center ml-1">
            {message.isPending && (
              <Clock className="w-3 h-3 text-gray-400" />
            )}
            {!message.isPending && !message.deliveredAt && !message.seenAt && (
              <Check className="w-3.5 h-3.5 text-gray-400" />
            )}
            {!message.isPending && message.deliveredAt && !message.seenAt && (
              <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
            )}
            {!message.isPending && message.seenAt && (
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
