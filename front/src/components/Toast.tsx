import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
  },
};

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = toastStyles[type];
  const Icon = styles.icon;

  return (
    <div className={`flex items-center p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
      <Icon className={`flex-shrink-0 w-5 h-5 ${styles.text}`} />
      <p className={`ml-3 mr-8 ${styles.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`ml-auto flex-shrink-0 ${styles.text} hover:opacity-75`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}