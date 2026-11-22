import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginCredentials, User } from '../types/auth';
import { authRepository } from '../repositories/authRepository';
import { authStorage } from '../api/authStorage';
import { AuthContext } from './authContextDefinition';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    authStorage.getToken()
  );
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const authData = await authRepository.login(credentials);

    const currentUser = await authRepository.getCurrentUser(authData.accessToken);

    authStorage.setSession(authData.accessToken, currentUser);
    setAccessToken(authData.accessToken);
    setUser(currentUser);
  };

  const logout = (): void => {
    authStorage.clearSession();
    setAccessToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(accessToken && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
