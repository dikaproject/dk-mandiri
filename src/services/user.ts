import api from './api';
import { User, CreateUserData, UpdateUserData } from '../types/user';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const resetPassword = async (id: string): Promise<{message: string, newPassword: string}> => {
  const response = await api.post(`/users/${id}/reset-password`);
  return response.data;
};