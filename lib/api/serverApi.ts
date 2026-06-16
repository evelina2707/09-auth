import { cookies } from 'next/headers';
import api from './api';
import type { User } from '@/types/user';

function getCookieHeader() {
  return cookies().toString();
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return data;
}

export async function checkSession(): Promise<boolean> {
  try {
    const { data } = await api.get('/auth/session', {
      headers: {
        Cookie: getCookieHeader(),
      },
    });

    return !!data;
  } catch {
    return false;
  }
}