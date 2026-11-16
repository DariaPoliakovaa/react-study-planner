import { useTaskContext } from '../hooks/useTaskContext';

export const TaskStats = () => {
  const { stats, totalServerTasks } = useTaskContext();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
        <div>
          <span className="text-slate-500 dark:text-slate-400">На сторінці: </span>
          <span className="text-slate-900 dark:text-white font-bold">{stats.totalOnPage}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Невиконано: </span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">
            {stats.uncompletedOnPage}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Виконано: </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {stats.completedOnPage}
          </span>
        </div>
      </div>

      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Всього на сервері: <span className="font-bold text-slate-700 dark:text-slate-200">{totalServerTasks}</span>
      </div>
    </div>
  );
};
