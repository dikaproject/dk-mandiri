import api from './api';
import { CartSummary, AddToCartData, UpdateCartItemData } from '@/types/cart';

export const getCart = async (): Promise<CartSummary> => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (data: AddToCartData): Promise<any> => {
  const response = await api.post('/cart/add', data);
  return response.data;
};

export const updateCartItem = async (id: string, data: UpdateCartItemData): Promise<any> => {
  const response = await api.put(`/cart/${id}`, data);
  return response.data;
};

export const removeFromCart = async (id: string): Promise<void> => {
  await api.delete(`/cart/${id}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete('/cart');
};