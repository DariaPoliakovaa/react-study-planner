import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  CreateTaskInput,
  FilterStatus,
  Task,
  ToastState,
  UpdateTaskInput,
} from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { ApiError } from '../api/httpClient';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';

export const PAGE_LIMIT = 10;

interface TaskContextType {

  tasks: Task[];
  filteredTasks: Task[];
  totalServerTasks: number;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  busyTaskIds: number[];

  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  toast: ToastState | null;
  hideToast: () => void;

  retryFetch: () => void;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: number, input: UpdateTaskInput) => Promise<boolean>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (task: Task) => Promise<void>;

  stats: {
    totalOnPage: number;
    completedOnPage: number;
    uncompletedOnPage: number;
  };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalServerTasks, setTotalServerTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busyTaskIds, setBusyTaskIds] = useState<number[]>([]);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useLocalStorage<FilterStatus>('study-planner-filter', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: ToastState['type'] = 'info',
    duration = 3000
  ) => {
    setToast({ id: Date.now(), message, type, duration });
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    const controller = new AbortController();
    const skip = (page - 1) * PAGE_LIMIT;

    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await taskRepository.getAll(PAGE_LIMIT, skip, controller.signal);
        setTasks(result.tasks);
        setTotalServerTasks(result.total);
      } catch (err) {
        if (err instanceof ApiError && err.isAborted) {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Не вдалося завантажити список завдань';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      controller.abort();
    };
  }, [page, reloadCounter]);

  const retryFetch = () => {
    setReloadCounter((prev) => prev + 1);
  };

  const uncompletedOnPage = tasks.filter((t) => !t.completed).length;
  useEffect(() => {
    document.title =
      uncompletedOnPage > 0
        ? `Study Planner (${uncompletedOnPage} active)`
        : 'Study Planner';
  }, [uncompletedOnPage]);

  const addTask = async (input: CreateTaskInput): Promise<boolean> => {
    setIsCreating(true);
    try {
      const created = await taskRepository.create(input);
      setTasks((prev) => [created, ...prev]);
      setTotalServerTasks((prev) => prev + 1);
      showToast('Завдання успішно створено на сервері!', 'success');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка створення завдання';
      showToast(message, 'error');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updateTask = async (id: number, input: UpdateTaskInput): Promise<boolean> => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return false;

    setBusyTaskIds((prev) => [...prev, id]);
    try {
      await taskRepository.update(id, input, target.isClientOnly);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...input } : task))
      );
      if (selectedTask?.id === id) {
        setSelectedTask((prev) => (prev ? { ...prev, ...input } : null));
      }
      setEditingTask(null);
      showToast('Завдання успішно оновлено!', 'success');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка оновлення завдання';
      showToast(message, 'error');
      return false;
    } finally {
      setBusyTaskIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const toggleTask = async (task: Task): Promise<void> => {
    const nextCompleted = !task.completed;
    setBusyTaskIds((prev) => [...prev, task.id]);

    try {
      await taskRepository.update(
        task.id,
        { completed: nextCompleted },
        task.isClientOnly
      );
      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, completed: nextCompleted } : item
        )
      );
      if (selectedTask?.id === task.id) {
        setSelectedTask((prev) => (prev ? { ...prev, completed: nextCompleted } : null));
      }
      showToast(
        nextCompleted ? 'Позначено як виконане' : 'Повернуто в роботу',
        'info'
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не вдалося змінити статус';
      showToast(message, 'error');
    } finally {
      setBusyTaskIds((prev) => prev.filter((itemId) => itemId !== task.id));
    }
  };

  const deleteTask = async (task: Task): Promise<void> => {
    setBusyTaskIds((prev) => [...prev, task.id]);
    try {
      await taskRepository.delete(task.id, task.isClientOnly);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      setTotalServerTasks((prev) => Math.max(0, prev - 1));
      if (selectedTask?.id === task.id) {
        setSelectedTask(null);
      }
      if (editingTask?.id === task.id) {
        setEditingTask(null);
      }
      showToast('Завдання видалено', 'warning');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка видалення завдання';
      showToast(message, 'error');
    } finally {
      setBusyTaskIds((prev) => prev.filter((itemId) => itemId !== task.id));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'completed'
        ? task.completed
        : !task.completed;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(totalServerTasks / PAGE_LIMIT));

  const stats = {
    totalOnPage: tasks.length,
    completedOnPage: tasks.filter((t) => t.completed).length,
    uncompletedOnPage,
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        totalServerTasks,
        isLoading,
        error,
        isCreating,
        busyTaskIds,
        page,
        totalPages,
        setPage,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        editingTask,
        setEditingTask,
        selectedTask,
        setSelectedTask,
        toast,
        hideToast,
        retryFetch,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
