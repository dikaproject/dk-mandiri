import api from './api';

export interface Review {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  imageUrl?: string;
  userId?: string;
  createdAt: string;
}

export interface CreateReviewData {
  name: string;
  email: string;
  message: string;
  rating: number;
  image?: File;
}

export const getAllReviews = async (): Promise<Review[]> => {
  const response = await api.get('/community');
  return response.data;
};

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('message', data.message);
  formData.append('rating', data.rating.toString());
  
  if (data.image) {
    formData.append('image', data.image);
  }
  
  const response = await api.post('/community', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/community/${id}`);
};