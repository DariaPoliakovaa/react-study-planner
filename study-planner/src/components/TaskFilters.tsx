import type { FilterStatus } from '../types/task';

interface TaskFiltersProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TaskFilters = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: TaskFiltersProps) => {
  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: 'Всі', value: 'all' },
    { label: 'Невиконані', value: 'active' },
    { label: 'Виконані', value: 'completed' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      {/* Пошуковий інпут (Додаткове завдання №1) */}
      <div>
        <input
          type="text"
          placeholder="Пошук завдань за назвою..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Кнопки фільтрів */}
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeFilter === option.value
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
