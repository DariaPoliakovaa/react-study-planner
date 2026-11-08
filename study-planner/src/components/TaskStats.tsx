import { useTaskContext } from '../hooks/useTaskContext';

export const TaskStats = () => {
  const { stats, clearCompleted, resetTasks } = useTaskContext();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-6 text-sm font-medium">
        <div>
          <span className="text-slate-500 dark:text-slate-400">Всього: </span>
          <span className="text-slate-900 dark:text-white font-bold">{stats.total}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Невиконано: </span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">{stats.uncompleted}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Виконано: </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.completed}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {stats.completed > 0 && (
          <button
            onClick={clearCompleted}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
          >
            Очистити виконані
          </button>
        )}
        <button
          onClick={resetTasks}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          title="Скинути дані до початкових"
        >
          Скинути дані
        </button>
      </div>
    </div>
  );
};
