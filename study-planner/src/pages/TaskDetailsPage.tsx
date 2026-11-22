import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import type { Task } from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { ApiError } from '../api/httpClient';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { TaskFormDialog } from '../components/TaskFormDialog';
import type { TaskFormData } from '../schemas/taskSchema';

interface TaskDetailsViewProps {
  taskId: number;
}

const TaskDetailsView = ({ taskId }: TaskDetailsViewProps) => {
  const { tasks, updateTask, deleteTask, showToast } = useTaskContext();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const cachedTask = tasks.find((t) => t.id === taskId);

  const [task, setTask] = useState<Task | null>(
    cachedTask?.isClientOnly ? cachedTask : null
  );
  const [isLoading, setIsLoading] = useState(!cachedTask?.isClientOnly);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (cachedTask?.isClientOnly) return;

    const controller = new AbortController();

    taskRepository
      .getById(taskId, controller.signal)
      .then((fetched) => {
        setTask((prev) => ({
          ...fetched,
          description: cachedTask?.description ?? prev?.description ?? fetched.description,
          category: cachedTask?.category ?? prev?.category ?? fetched.category,
          priority: cachedTask?.priority ?? prev?.priority ?? fetched.priority,
          title: cachedTask?.title ?? fetched.title,
          completed: cachedTask?.completed ?? fetched.completed,
          createdBy: cachedTask?.createdBy ?? fetched.createdBy,
          createdAt: cachedTask?.createdAt ?? fetched.createdAt,
        }));
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.isAborted) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'Не вдалося завантажити деталі завдання';
        setError(message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [taskId, reloadTick, cachedTask]);

  const requireAuth = (actionLabel: string): boolean => {
    if (!isAuthenticated) {
      showToast(`Увійдіть у систему, щоб ${actionLabel}`, 'warning');
      navigate('/login', { state: { from: location } });
      return false;
    }
    return true;
  };

  const handleOpenEdit = () => {
    if (!requireAuth('редагувати завдання')) return;
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (!task) return;
    if (!requireAuth('редагувати завдання')) return;

    const success = await updateTask(task.id, data);
    if (success) {
      setTask((prev) => (prev ? { ...prev, ...data } : null));
      setIsEditOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!requireAuth('видаляти завдання')) return;

    const success = await deleteTask(task);
    if (success) {
      navigate('/tasks');
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadTick((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Назад до списку завдань
        </Link>
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center space-y-3">
          <div className="inline-block h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Завантаження деталей завдання #{taskId}...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 p-8 text-center space-y-3">
          <p className="font-semibold text-rose-700 dark:text-rose-300">
            Помилка завантаження деталей завдання.
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium cursor-pointer"
          >
            Спробувати ще
          </button>
        </div>
      )}

      {!isLoading && !error && task && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Завдання #{task.id}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {task.title}
              </h1>
            </div>

            {/* Кнопки захищених дій: Редагувати та Видалити */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Редагувати
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800">
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                    Підтвердити?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Так
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                  >
                    Ні
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (requireAuth('видаляти завдання')) {
                      setConfirmDelete(true);
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-sm font-medium transition-colors cursor-pointer"
                >
                  Видалити
                </button>
              )}
            </div>
          </div>

          {/* Опис */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Опис завдання
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {task.description || 'Опис для цього завдання ще не додано.'}
            </p>
          </div>

          {/* Основні параметри */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <span className="block text-xs text-slate-400">Категорія</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">
                {task.category}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <span className="block text-xs text-slate-400">Пріоритет</span>
              <span className="font-semibold capitalize text-slate-900 dark:text-white text-sm">
                {task.priority}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <span className="block text-xs text-slate-400">Стан виконання</span>
              <span
                className={`font-semibold text-sm ${
                  task.completed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {task.completed ? 'Виконано' : 'Не виконано'}
              </span>
            </div>
          </div>

          {/* Client-owned metadata: createdBy та createdAt */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Автор (client metadata):{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {task.createdBy}
              </span>
            </div>
            <div>
              Дата створення (client metadata):{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {new Date(task.createdAt).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Повторно використовуваний TaskFormDialog у режимі edit */}
          <TaskFormDialog
            open={isEditOpen}
            mode="edit"
            task={task}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleEditSubmit}
          />
        </div>
      )}
    </div>
  );
};

export const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const numericId = Number(taskId);

  if (!taskId || Number.isNaN(numericId) || numericId <= 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-4">
        <p className="text-lg font-bold text-rose-600">Некоректний ID завдання</p>
        <Link
          to="/tasks"
          className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium"
        >
          Повернутися до списку
        </Link>
      </div>
    );
  }

  return <TaskDetailsView key={numericId} taskId={numericId} />;
};
