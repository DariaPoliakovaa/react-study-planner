import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import type { FilterStatus, PriorityFilter } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { TaskStats } from '../components/TaskStats';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { Pagination } from '../components/Pagination';
import { TaskFormDialog } from '../components/TaskFormDialog';
import type { TaskFormData } from '../schemas/taskSchema';

const VALID_STATUSES: FilterStatus[] = ['all', 'active', 'completed'];
const VALID_PRIORITIES: PriorityFilter[] = ['all', 'low', 'medium', 'high'];

export const TasksPage = () => {
  const { tasks, debouncedSearch, addTask, showToast } = useTaskContext();
  const { isAuthenticated } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const rawStatus = searchParams.get('status') as FilterStatus | null;
  const statusFilter: FilterStatus =
    rawStatus && VALID_STATUSES.includes(rawStatus) ? rawStatus : 'all';

  const rawPriority = searchParams.get('priority') as PriorityFilter | null;
  const priorityFilter: PriorityFilter =
    rawPriority && VALID_PRIORITIES.includes(rawPriority) ? rawPriority : 'all';

  const handleStatusChange = (nextStatus: FilterStatus) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextStatus === 'all') {
        next.delete('status');
      } else {
        next.set('status', nextStatus);
      }
      return next;
    });
  };

  const handlePriorityChange = (nextPriority: PriorityFilter) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPriority === 'all') {
        next.delete('priority');
      } else {
        next.set('priority', nextPriority);
      }
      return next;
    });
  };

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      showToast('Увійдіть у систему, щоб створити завдання', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (data: TaskFormData) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const success = await addTask(data);
    if (success) {
      setIsCreateOpen(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? task.completed
        : !task.completed;

    const matchesPriority =
      priorityFilter === 'all' ? true : task.priority === priorityFilter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Заголовок сторінки + кнопка "+" для відкриття TaskFormDialog */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Навчальні завдання
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Керуйте своїм прогресом навчання
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          <span>Додати завдання</span>
        </button>
      </div>

      <TaskStats />

      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      <TaskList tasks={filteredTasks} />

      <Pagination />

      <TaskFormDialog
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
