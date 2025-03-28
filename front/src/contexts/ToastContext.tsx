import { createContext, useContext, ReactNode, createElement } from 'react';
import { useToast } from '../hooks/useToast';
import type { ToastType } from '../components/Toast';

interface ToastContextType {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
  }>;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastHelpers = useToast();
  
  return createElement(
    ToastContext.Provider,
    { value: toastHelpers },
    children
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
