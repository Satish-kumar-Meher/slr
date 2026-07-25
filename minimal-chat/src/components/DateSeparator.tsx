import React from 'react';

interface DateSeparatorProps {
  date: Date;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const getLabel = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="flex justify-center my-6">
      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
        {getLabel()}
      </span>
    </div>
  );
};
