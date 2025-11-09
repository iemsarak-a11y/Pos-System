import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Toast from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModal';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ConfirmationState {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ToastContextType {
  addToast: (toast: { message: string; type: ToastType }) => void;
  requestConfirmation: (confirmation: { message: string; onConfirm: () => void }) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback(({ message, type }: { message: string; type: ToastType }) => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const requestConfirmation = useCallback(({ message, onConfirm }: { message: string; onConfirm: () => void }) => {
    setConfirmation({
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmation(null);
      },
      onCancel: () => {
        setConfirmation(null);
      },
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, requestConfirmation }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <ConfirmationModal
        isOpen={!!confirmation}
        message={confirmation?.message || ''}
        onConfirm={confirmation?.onConfirm || (() => {})}
        onCancel={confirmation?.onCancel || (() => {})}
      />
    </ToastContext.Provider>
  );
};
