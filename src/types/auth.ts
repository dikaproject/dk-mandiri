export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}