export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdBy: string;
  createdAt: string;
  isClientOnly?: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | Priority;

export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

export type CreateTaskInput = Omit<
  Task,
  'id' | 'completed' | 'createdBy' | 'createdAt' | 'isClientOnly'
>;

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  category?: string;
}

export interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
