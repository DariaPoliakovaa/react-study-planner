import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import { ApiError } from '../api/httpClient';
import type { Task } from '../types/task';

export const TaskDetailsModal = () => {
  const { selectedTask, setSelectedTask } = useTaskContext();

  const [details, setDetails] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    if (!selectedTask) {
      setDetails(null);
      setError(null);
      return;
    }

    if (selectedTask.isClientOnly) {
      setDetails(selectedTask);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const freshTask = await taskRepository.getById(selectedTask.id, controller.signal);
        setDetails({
          ...selectedTask,
          title: freshTask.title,
          completed: freshTask.completed,
        });
      } catch (err) {
        if (err instanceof ApiError && err.isAborted) {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Не вдалося завантажити деталі завдання';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      controller.abort();
    };
  }, [selectedTask, reloadTick]);

  if (!selectedTask) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setSelectedTask(null)}
    >
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Деталі завдання #{selectedTask.id}
          </h2>
          <button
            onClick={() => setSelectedTask(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
            title="Закрити"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading... Завантаження актуальних даних із сервера...
          </div>
        )}

        {!isLoading && error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-3">
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            <button
              onClick={() => setReloadTick((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              Спробувати ще
            </button>
          </div>
        )}

        {!isLoading && !error && details && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Назва
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {details.title}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Опис
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                {details.description || 'Опис відсутній'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="block text-[11px] text-slate-400">Категорія</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {details.category}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="block text-[11px] text-slate-400">Пріоритет</span>
                <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">
                  {details.priority}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="block text-[11px] text-slate-400">Статус</span>
                <span
                  className={`font-semibold ${
                    details.completed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {details.completed ? 'Виконано' : 'Активне'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setSelectedTask(null)}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition-colors cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
