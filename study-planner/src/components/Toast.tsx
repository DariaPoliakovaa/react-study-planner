import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const Toast = () => {
  const { toast, hideToast } = useTaskContext();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    const duration = toast.duration || 3000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    setProgress(100);

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
      hideToast();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [toast, hideToast]);

  if (!toast) return null;

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
        <div className="flex items-center gap-2 text-sm font-medium pr-2">
          <span>{toast.message}</span>
        </div>

        <div className="flex items-center gap-2">
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                hideToast();
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-white/30 whitespace-nowrap"
            >
              Скасувати
            </button>
          )}
          <button
            onClick={hideToast}
            className="text-white/70 hover:text-white p-1 text-xs transition-colors cursor-pointer"
            title="Закрити"
          >
            ✕
          </button>
        </div>

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
