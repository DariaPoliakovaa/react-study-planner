import { httpClient } from '../api/httpClient';
import type {
  ApiTodo,
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TodosResponse,
  UpdateTaskInput,
} from '../types/task';

interface ClientTaskMeta extends Partial<CreateTaskInput> {
  createdBy?: string;
  createdAt?: string;
}

function toTask(apiTodo: ApiTodo, clientMeta?: ClientTaskMeta): Task {
  const fallbackDate = new Date(Date.UTC(2026, 10, (apiTodo.id % 28) + 1)).toISOString();

  return {
    id: apiTodo.id,
    title: apiTodo.todo,
    description: clientMeta?.description ?? '',
    completed: apiTodo.completed,
    priority: clientMeta?.priority ?? 'medium',
    category: clientMeta?.category ?? 'General',
    createdBy: clientMeta?.createdBy ?? `User #${apiTodo.userId}`,
    createdAt: clientMeta?.createdAt ?? fallbackDate,
  };
}

export const taskRepository = {
  async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<PaginatedTasks> {
    const data = await httpClient.get<TodosResponse>(
      `/todos?limit=${limit}&skip=${skip}`,
      signal
    );

    return {
      tasks: data.todos.map((todo) => toTask(todo)),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const data = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
    return toTask(data);
  },

  async create(input: CreateTaskInput, authorUsername = 'Student'): Promise<Task> {
    const payload = {
      todo: input.title,
      completed: false,
      userId: 1,
    };

    const created = await httpClient.post<ApiTodo, typeof payload>('/todos/add', payload);

    return {
      ...toTask(created, {
        ...input,
        createdBy: authorUsername,
        createdAt: new Date().toISOString(),
      }),
      id: Date.now(),
      isClientOnly: true,
    };
  },

  async update(
    id: number,
    input: UpdateTaskInput,
    isClientOnly = false
  ): Promise<Partial<Task>> {
    if (!isClientOnly) {
      const apiPayload: { todo?: string; completed?: boolean } = {};
      if (input.title !== undefined) apiPayload.todo = input.title;
      if (input.completed !== undefined) apiPayload.completed = input.completed;

      if (Object.keys(apiPayload).length > 0) {
        await httpClient.patch<ApiTodo, typeof apiPayload>(`/todos/${id}`, apiPayload);
      }
    }

    return input;
  },

  async delete(id: number, isClientOnly = false): Promise<void> {
    if (!isClientOnly) {
      await httpClient.delete<{ id: number; isDeleted: boolean }>(`/todos/${id}`);
    }
  },
};
