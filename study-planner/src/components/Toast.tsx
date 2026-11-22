import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { ToastState } from '../types/task';

interface ToastBannerProps {
  toast: ToastState;
  onClose: () => void;
}

const ToastBanner = ({ toast, onClose }: ToastBannerProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = toast.duration || 3000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [toast, onClose]);

  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-indigo-600 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full px-4 sm:px-0">
      <div
        className={`relative overflow-hidden rounded-xl shadow-xl p-4 flex items-center justify-between gap-3 transition-all ${
          typeStyles[toast.type]
        }`}
      >
        <div className="text-sm font-medium pr-2">{toast.message}</div>

        <button
          type="button"
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 text-xs transition-colors cursor-pointer"
          title="Закрити"
        >
          ✕
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-white/80 transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const Toast = () => {
  const { toast, hideToast } = useTaskContext();

  if (!toast) return null;

  return <ToastBanner key={toast.id} toast={toast} onClose={hideToast} />;
};
