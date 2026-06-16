'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const sessionValid = await checkSession();

        if (!sessionValid) {
          clearAuth();
          return;
        }

        const user = await getMe();

        if (!ignore) setUser(user);
      } catch {
        clearAuth();
      }
    })();

    return () => {
      ignore = true;
    };
  }, [setUser, clearAuth]);

  return <>{children}</>;
}