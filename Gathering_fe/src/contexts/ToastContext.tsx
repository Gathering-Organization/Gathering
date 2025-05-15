import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, status: boolean, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastStatus, setToastStatus] = useState(true);
  const [toastDuration, setToastDuration] = useState(3000);

  const showToast = useCallback((message: string, status: boolean, duration: number = 3000) => {
    setToastMessage('');
    setToastStatus(status);
    setToastDuration(duration);
    setTimeout(() => {
      setToastMessage(message);
    }, 0);
  }, []);

  const handleToastClose = () => {
    setToastMessage('');
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={handleToastClose}
          status={toastStatus}
          duration={toastDuration}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
};
