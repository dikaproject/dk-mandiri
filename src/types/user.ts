export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  phone: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}