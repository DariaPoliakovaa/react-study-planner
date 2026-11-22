import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '../types/task';
import { taskSchema } from '../schemas/taskSchema';
import type { TaskFormData } from '../schemas/taskSchema';

export interface TaskFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

interface TaskFormDialogContentProps {
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

const TaskFormDialogContent = ({
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogContentProps) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      category: task?.category ?? 'General',
      priority: task?.priority ?? 'medium',
    },
  });

  useEffect(() => {
    setFocus('title');
  }, [setFocus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-dialog-title"
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h2
            id="task-form-dialog-title"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            {mode === 'edit' ? 'Редагувати завдання' : 'Нове навчальне завдання'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Закрити діалог"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          {/* Поле: Назва */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              Назва завдання *
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Наприклад: Налаштувати React Router 8"
              disabled={isSubmitting}
              {...register('title')}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Поле: Опис */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              Опис
            </label>
            <textarea
              id="task-description"
              rows={3}
              placeholder="Деталі виконання завдання..."
              disabled={isSubmitting}
              {...register('description')}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Поле: Категорія */}
            <div>
              <label
                htmlFor="task-category"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
              >
                Категорія *
              </label>
              <input
                id="task-category"
                type="text"
                placeholder="Наприклад: React"
                disabled={isSubmitting}
                {...register('category')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
              />
              {errors.category && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Поле: Пріоритет */}
            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
              >
                Пріоритет *
              </label>
              <select
                id="task-priority"
                disabled={isSubmitting}
                {...register('priority')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
              >
                <option value="low">Низький (Low)</option>
                <option value="medium">Середній (Medium)</option>
                <option value="high">Високий (High)</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Кнопки дій */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Збереження...'
                : mode === 'edit'
                ? 'Зберегти зміни'
                : 'Створити завдання'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TaskFormDialog = ({
  open,
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogProps) => {
  if (!open) return null;

  return (
    <TaskFormDialogContent
      key={mode === 'edit' && task ? `edit-${task.id}` : 'create'}
      mode={mode}
      task={task}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
