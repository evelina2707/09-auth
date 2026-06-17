import api from './api';
import type { Note, CreateNoteData, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export async function fetchNotes(params: {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: NoteTag;
}) {
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    '/notes',
    { params }
  );

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const { data } = await api.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}

export async function register(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>('/auth/register', { email, password });
  return data;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>('/auth/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}