const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export class ApiError extends Error {
  status: number;
  isAborted: boolean;

  constructor(message: string, status = 500, isAborted = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isAborted = isAborted;
  }
}

function normalizeError(error: unknown, fallbackStatus = 500): ApiError {
  if (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  ) {
    return new ApiError('Запит було скасовано', 0, true);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new ApiError(
      'Не вдалося з’єднатися із сервером. Перевірте підключення до інтернету.',
      0,
      false
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, fallbackStatus, false);
  }

  return new ApiError('Виникла невідома помилка під час запиту', fallbackStatus, false);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let serverMessage = '';
      try {
        const errorData = await response.json();
        serverMessage = errorData?.message || '';
      } catch {}

      throw new ApiError(
        serverMessage || `Помилка сервера (HTTP ${response.status})`,
        response.status,
        false
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const httpClient = {
  get: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'GET', signal }),

  post: <T, B>(endpoint: string, body: B) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T, B>(endpoint: string, body: B) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
