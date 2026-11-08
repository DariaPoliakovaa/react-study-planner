import type { FilterStatus } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskFilters = () => {
  const { filter, setFilter, searchQuery, setSearchQuery } = useTaskContext();

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Невиконані', value: 'active' },
    { label: 'Виконані', value: 'completed' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-4 transition-colors">
      <div>
        <input
          type="text"
          placeholder="Пошук завдань за назвою..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === option.value
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
