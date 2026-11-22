import type { FilterStatus, PriorityFilter } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskFiltersProps {
  statusFilter: FilterStatus;
  priorityFilter: PriorityFilter;
  onStatusChange: (status: FilterStatus) => void;
  onPriorityChange: (priority: PriorityFilter) => void;
}

export const TaskFilters = ({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) => {
  const { searchQuery, setSearchQuery } = useTaskContext();

  const statusOptions: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Невиконані', value: 'active' },
    { label: 'Виконані', value: 'completed' },
  ];

  const priorityOptions: { label: string; value: PriorityFilter }[] = [
    { label: 'Будь-який пріоритет', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Фільтр за статусом (URL query param: status) */}
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                statusFilter === option.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Фільтр за пріоритетом (URL query param: priority) */}
        <select
          aria-label="Фільтр за пріоритетом"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
