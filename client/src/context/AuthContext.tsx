import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'user';

interface AuthState {
  name: string;
  email?: string;
  role: Role;
  isAuthenticated?: boolean;
  token?: string;
  id?: number | string;
}

interface AuthContextValue {
  user: AuthState;
  setRole: (role: Role) => void;
  setProfile: (profile: Partial<AuthState>) => void;
  login: (profile: { id: number | string; name: string; email: string; role: Role; token: string }) => void;
  logout: () => void;
}

const defaultUser: AuthState = {
  name: 'Guest',
  role: 'user',
  isAuthenticated: false,
};

const STORAGE_KEY = 'ticket-booking-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthState>(() => {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (!persisted) return defaultUser;
    try {
      return JSON.parse(persisted) as AuthState;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setRole: (role) => setUser((prev) => ({ ...prev, role })),
      setProfile: (profile) => setUser((prev) => ({ ...prev, ...profile })),
      login: ({ id, name, email, role, token }) =>
        setUser({
          id,
          name,
          email,
          role,
          isAuthenticated: true,
          token,
        }),
      logout: () => setUser(defaultUser),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

