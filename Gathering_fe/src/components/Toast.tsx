import React, { useEffect } from 'react';
import doneIcon from '@/assets/otherIcons/Done.png';
import dangerIcon from '@/assets/otherIcons/No Entry.png';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number; // 기본값: 3초
  status: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000, status }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="z-50 fixed bottom-0 left-0 right-0 flex justify-center pb-4">
      <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md font-semibold text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm animate-fade-in-out">
        {status ? (
          <img src={doneIcon} alt="done" className="w-5 h-5" />
        ) : (
          <img src={dangerIcon} alt="danger" className="w-5 h-5" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
