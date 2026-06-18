import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import api from './api';

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  return await api.get<{ success: boolean }>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const res = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const fetchNotes = async (params?: Record<string, unknown>): Promise<Note[]> => {
  const cookieStore = await cookies();
  const res = await api.get<Note[]>('/notes', {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};