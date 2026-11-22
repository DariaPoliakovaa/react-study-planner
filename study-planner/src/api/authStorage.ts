import type { User } from '../types/auth';

const TOKEN_KEY = 'study-planner-access-token';
const USER_KEY = 'study-planner-user';

export const authStorage = {
  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  },

  setSession(token: string, user: User): void {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};
