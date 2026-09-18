import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { Toaster } from '../components/ui/Toaster.jsx';

const ToastContext = createContext(null);

const DURATION_BY_TONE = { success: 4000, info: 4000, error: 6500 };
const MAX_VISIBLE = 4;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone, message, options = {}) => {
      nextId.current += 1;
      const id = nextId.current;
      const duration = options.duration ?? DURATION_BY_TONE[tone] ?? 4000;

      setToasts((list) => [...list, { id, tone, message }].slice(-MAX_VISIBLE));

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message, options) => push('success', message, options),
      error: (message, options) => push('error', message, options),
      info: (message, options) => push('info', message, options),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
};
