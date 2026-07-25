export function formatLastSeen(timestamp: number | null): string {
  if (!timestamp) return '';

  const now = Date.now();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMinutes < 1) {
    return 'Last seen just now';
  } else if (diffInMinutes < 60) {
    return `Last seen ${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    const date = new Date(timestamp);
    return `Last seen ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    const date = new Date(timestamp);
    // Check if it was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Last seen yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    return `Last seen ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
}
