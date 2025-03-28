import { createContext, useContext } from 'react';
import type { ToastType } from '../components/Toast';

export interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export const useToastContext = () => useContext(ToastContext);
