import api from './api';
import { Address, AddressData } from '@/types/address';

export const getUserAddresses = async (): Promise<Address[]> => {
  // Perbaiki endpoint yang seharusnya /api/address
  const response = await api.get('/address');
  return response.data;
};

// Perbaiki endpoint untuk addAddress
export const addAddress = async (data: AddressData): Promise<Address> => {
  // Sesuaikan dengan backend route: /api/address/add
  const response = await api.post('/address/add', data);
  return response.data;
};

// Perbaiki endpoint lainnya
export const updateAddress = async (id: string, data: AddressData): Promise<Address> => {
  const response = await api.put(`/address/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/address/${id}`);
};

export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await api.put(`/address/${id}/default`);
  return response.data;
};