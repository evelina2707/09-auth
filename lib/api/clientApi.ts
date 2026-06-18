import  api from './api';
import { User } from '@/types/user';
import { Note, CreateNoteData } from '@/types/note';
import { NotesResponse } from '@/types/note';

export type RegisterRequest = { email: string; password: string };
export type LoginRequest = { email: string; password: string };
export type UpdateUserRequest = { username: string };

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  const res = await api.get<{ success: boolean }>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (data: UpdateUserRequest): Promise<User> => {
  const res = await api.patch<User>('/users/me', data); 
  return res.data;
};

export const fetchNotes = async (params?: Record<string, unknown>): Promise<NotesResponse> => {
  const res = await api.get<NotesResponse>('/notes', { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const res = await api.post<Note>('/notes', data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};