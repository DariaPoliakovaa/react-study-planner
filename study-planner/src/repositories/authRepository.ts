import { httpClient } from '../api/httpClient';
import type { AuthResponse, LoginCredentials, User } from '../types/auth';

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse, LoginCredentials>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });
  },

  async getCurrentUser(token?: string, signal?: AbortSignal): Promise<User> {
    return httpClient.get<User>('/auth/me', signal, token);
  },
};
