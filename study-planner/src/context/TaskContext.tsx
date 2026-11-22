import { useState, useEffect } from 'react';
import type {ReactNode} from 'react';
import type {
  CreateTaskInput,
  Task,
  ToastState,
  UpdateTaskInput,
} from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { ApiError } from '../api/httpClient';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthContext } from '../hooks/useAuthContext';
import { PAGE_LIMIT, TaskContext } from './taskContextDefinition';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuthContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalServerTasks, setTotalServerTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [busyTaskIds, setBusyTaskIds] = useState<number[]>([]);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
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
    if (!isAuthenticated || !user) {
      showToast('Авторизуйтеся, щоб створювати завдання', 'warning');
      return false;
    }

    setIsCreating(true);
    try {
      const created = await taskRepository.create(input, user.username);
      setTasks((prev) => [created, ...prev]);
      setTotalServerTasks((prev) => prev + 1);
      showToast('Завдання успішно створено!', 'success');
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
    if (!isAuthenticated) {
      showToast('Авторизуйтеся, щоб редагувати завдання', 'warning');
      return false;
    }

    const target = tasks.find((t) => t.id === id);
    setBusyTaskIds((prev) => [...prev, id]);

    try {
      await taskRepository.update(id, input, target?.isClientOnly ?? false);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...input } : task))
      );
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
    if (!isAuthenticated) {
      showToast('Увійдіть у систему, щоб змінювати статус завдання', 'warning');
      return;
    }

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

  const deleteTask = async (task: Task): Promise<boolean> => {
    if (!isAuthenticated) {
      showToast('Авторизуйтеся, щоб видаляти завдання', 'warning');
      return false;
    }

    setBusyTaskIds((prev) => [...prev, task.id]);
    try {
      await taskRepository.delete(task.id, task.isClientOnly);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      setTotalServerTasks((prev) => Math.max(0, prev - 1));
      showToast('Завдання видалено', 'warning');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка видалення завдання';
      showToast(message, 'error');
      return false;
    } finally {
      setBusyTaskIds((prev) => prev.filter((itemId) => itemId !== task.id));
    }
  };

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
        totalServerTasks,
        isLoading,
        error,
        isCreating,
        busyTaskIds,
        page,
        totalPages,
        setPage,
        searchQuery,
        setSearchQuery,
        debouncedSearch,
        toast,
        showToast,
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
