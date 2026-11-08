import { createContext, useReducer, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Task, FilterStatus, ToastState } from '../types/task';
import { taskReducer } from '../reducers/taskReducer';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LOCAL_STORAGE_KEY = 'study-planner-tasks-v1';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type: ToastState['type'], duration?: number, onUndo?: () => void) => void;
  hideToast: () => void;
  addTask: (newTask: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  stats: {
    total: number;
    completed: number;
    uncompleted: number;
  };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getInitialTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return initialTasks;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialTasks;
  } catch (error) {
    console.error('Помилка завантаження завдань з localStorage:', error);
    return initialTasks;
  }
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, dispatch] = useReducer(taskReducer, [], getInitialTasks);
  const [filter, setFilter] = useLocalStorage<FilterStatus>('study-planner-filter', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

const pendingTimersRef = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Помилка збереження завдань у localStorage:', error);
    }
  }, [tasks]);

  const uncompletedCount = tasks.filter((t) => !t.completed && !t.isPendingDelete).length;
  useEffect(() => {
    document.title = uncompletedCount > 0 
      ? `Study Planner (${uncompletedCount} active)` 
      : 'Study Planner';
  }, [uncompletedCount]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const newTasks = JSON.parse(e.newValue);
          if (Array.isArray(newTasks)) {
            dispatch({ type: 'SET_TASKS', payload: newTasks });
          }
        } catch (err) {
          console.error('Помилка синхронізації між вкладками:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (
    message: string,
    type: ToastState['type'] = 'info',
    duration = 3000,
    onUndo?: () => void
  ) => {
    setToast({ id: Date.now(), message, type, duration, onUndo });
  };

  const hideToast = () => setToast(null);

  const addTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    dispatch({ type: 'ADD_TASK', payload: newTaskData });
    showToast('Завдання успішно додано!', 'success');
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    setEditingTask(null);
    showToast('Завдання оновлено!', 'info');
  };

  const toggleTask = (id: number) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const requestDelete = (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    dispatch({ type: 'REQUEST_DELETE', payload: id });

    if (pendingTimersRef.current[id]) {
      clearTimeout(pendingTimersRef.current[id]);
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'CONFIRM_DELETE', payload: id });
      delete pendingTimersRef.current[id];
      showToast('Завдання видалено остаточно', 'warning');
    }, 5000);

    pendingTimersRef.current[id] = timer;

    showToast(
      `«${taskToDelete.title.slice(0, 20)}...» буде видалено`,
      'warning',
      5000,
      () => undoDelete(id)
    );
  };

  const undoDelete = (id: number) => {
    if (pendingTimersRef.current[id]) {
      clearTimeout(pendingTimersRef.current[id]);
      delete pendingTimersRef.current[id];
    }
    dispatch({ type: 'UNDO_DELETE', payload: id });
    showToast('Видалення скасовано', 'info');
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
    showToast('Виконані завдання очищено', 'info');
  };

  const resetTasks = () => {
    dispatch({ type: 'RESET_TASKS', payload: initialTasks });
    showToast('Дані скинуто до початкових', 'info');
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
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.filter((t) => !t.isPendingDelete).length,
    completed: tasks.filter((t) => t.completed && !t.isPendingDelete).length,
    uncompleted: tasks.filter((t) => !t.completed && !t.isPendingDelete).length,
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        editingTask,
        setEditingTask,
        toast,
        showToast,
        hideToast,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        clearCompleted,
        resetTasks,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
