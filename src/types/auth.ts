export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  isVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  phone?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}