import { cookies } from 'next/headers';
import api from './api';
import type { User } from '@/types/user';

async function getCookieHeader() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const cookiesArray: string[] = [];
  if (accessToken) cookiesArray.push(`accessToken=${accessToken}`);
  if (refreshToken) cookiesArray.push(`refreshToken=${refreshToken}`);

  return cookiesArray.join('; ');
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<User>('/users/me', {
    headers: { 
      'Cookie': cookieHeader,
    },
  });
  return data;
}

export async function checkSession(): Promise<boolean> {
  try {
    const cookieHeader = await getCookieHeader();
    const { data } = await api.get('/auth/session', {
      headers: { 
        'Cookie': cookieHeader,
      },
    });
    return !!data;
  } catch {
    return false;
  }
}