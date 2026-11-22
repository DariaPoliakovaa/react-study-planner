import { createContext } from 'react';
import type {
  CreateTaskInput,
  Task,
  ToastState,
  UpdateTaskInput,
} from '../types/task';

export const PAGE_LIMIT = 10;

export interface TaskContextType {
  tasks: Task[];
  totalServerTasks: number;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  busyTaskIds: number[];

  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearch: string;
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState['type'], duration?: number) => void;
  hideToast: () => void;

  retryFetch: () => void;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: number, input: UpdateTaskInput) => Promise<boolean>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (task: Task) => Promise<boolean>;

  stats: {
    totalOnPage: number;
    completedOnPage: number;
    uncompletedOnPage: number;
  };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
