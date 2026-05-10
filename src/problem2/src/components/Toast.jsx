import { useEffect } from 'react';

export default function Toast({ message, type, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
    ? 'bg-red-500' 
    : 'bg-blue-500';

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-sm bg-opacity-95`}>
        <span className="text-2xl">
          {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
        </span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
