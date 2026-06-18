'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  useEffect(() => {
    checkSession().then(async (isValid) => {
      if (isValid) {
        const user = await getMe();
        setUser(user);
      } else {
        clearIsAuthenticated();
      }
    });
  }, [setUser, clearIsAuthenticated]);
  return <>{children}</>;
}