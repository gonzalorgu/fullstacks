import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  isActive: boolean;
  role?: 'admin' | 'user';
  createdAt?: Date;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
   private readonly API_URL = `${environment.apiUrl}/auth`;


  // ✅ OBTENER TODOS LOS USUARIOS
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  // ✅ OBTENER UN USUARIO POR ID
  getOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  // ✅ CREAR NUEVO USUARIO
  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user);
  }

  // ✅ ACTUALIZAR USUARIO
  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}`, user);
  }

  // ✅ ELIMINAR USUARIO
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${id}`);
  }

  // ✅ TOGGLE ESTADO (ACTIVO/INACTIVO)
  toggleActive(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/users/${id}/toggle-active`, {});
  }
}
