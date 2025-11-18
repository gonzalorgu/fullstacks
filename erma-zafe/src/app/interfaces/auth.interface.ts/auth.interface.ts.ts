// =====================================
// 🔐 INTERFACES DE AUTENTICACIÓN
// =====================================

export interface User {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface UpdateProfileDto {
  nombre?: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
}