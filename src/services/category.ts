import api from './api';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get('/category');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  const response = await api.post('/category', data);
  return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryData): Promise<Category> => {
  const response = await api.put(`/category/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/category/${id}`);
};