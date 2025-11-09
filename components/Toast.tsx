import React, { useEffect, useState } from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    style: 'bg-green-50 border-green-200',
  },
  error: {
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
    style: 'bg-red-50 border-red-200',
  },
  warning: {
    icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
    style: 'bg-yellow-50 border-yellow-200',
  },
  info: {
    icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
    style: 'bg-blue-50 border-blue-200',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);
    
    // Set up dismissal animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Start fade out before it's removed

    return () => clearTimeout(timer);
  }, []);

  const config = toastConfig[type];

  return (
    <div
      className={`relative w-full p-4 rounded-lg shadow-lg border flex items-start gap-4 transition-all duration-300 transform ${config.style} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1 text-sm font-medium text-slate-700">
        {message}
      </div>
      <button onClick={onDismiss} className="flex-shrink-0 text-slate-400 hover:text-slate-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
