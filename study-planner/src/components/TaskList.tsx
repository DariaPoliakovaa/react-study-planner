import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { filteredTasks, isLoading, error, retryFetch } = useTaskContext();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-10 text-center space-y-3 transition-colors">
        <div className="inline-block h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 p-8 text-center space-y-3">
        <p className="font-semibold text-rose-700 dark:text-rose-300">
          Помилка завантаження.
        </p>
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        <button
          onClick={retryFetch}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          Спробувати ще
        </button>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
        <p className="text-sm font-medium">Завдань не знайдено.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
