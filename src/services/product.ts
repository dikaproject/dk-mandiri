import api from './api';
import { Product, CreateProductData, UpdateProductData } from '@/types/product';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProductStock = async (id: string, weightInStock: number): Promise<Product> => {
  const response = await api.patch(`/products/${id}/stock`, { weightInStock });
  return response.data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const uploadProductImage = async (productId: string, imageFile: File, isPrimary: boolean = false): Promise<any> => {
  const formData = new FormData();
  formData.append('productId', productId);
  
  // Ubah dari 'image' menjadi 'images' sesuai dengan konfigurasi backend
  formData.append('images', imageFile);
  
  // Tambahkan primaryIndex jika gambar ini adalah primary
  if (isPrimary) {
    formData.append('primaryIndex', '0');
  }
  
  const response = await api.post('/product-images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const setPrimaryImage = async (imageId: string): Promise<any> => {
  const response = await api.put(`/product-images/${imageId}/primary`);
  return response.data;
};

export const deleteProductImage = async (imageId: string): Promise<void> => {
  await api.delete(`/product-images/${imageId}`);
};

export const getTrendingProducts = async (limit = 4): Promise<Product[]> => {
  const response = await api.get(`/products/trending?limit=${limit}`);
  return response.data;
};