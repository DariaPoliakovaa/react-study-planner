import { useTaskContext } from '../hooks/useTaskContext';

export const Pagination = () => {
  const { page, totalPages, setPage, totalServerTasks, isLoading } = useTaskContext();

  if (totalServerTasks === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Сторінка <span className="font-bold text-slate-900 dark:text-white">{page}</span> з{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>{' '}
        <span className="text-xs text-slate-400">({totalServerTasks} завдань у базі)</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ← Попередня
        </button>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || isLoading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Наступна →
        </button>
      </div>
    </div>
  );
};
