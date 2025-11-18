import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  User,
  AuthResponse,
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  ResetPasswordDto,
  UpdateProfileDto
} from '../../interfaces/auth.interface.ts/auth.interface.ts';
import { environment } from '../../../environments/environments.js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_data';

  // ✨ Signals para estado reactivo
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // ✨ Computed signals
  isLoggedIn = computed(() => !!this.currentUserSignal());
  currentUser = computed(() => this.currentUserSignal());
  userName = computed(() => this.currentUserSignal()?.nombre || '');
  userRole = computed(() => this.currentUserSignal()?.role || '');
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {
    this.loadFromStorage();
  }

  // ===============================
  // 🔐 AUTENTICACIÓN
  // ===============================

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  login(data: LoginDto): Observable<AuthResponse> {
    // ✅ NORMALIZAR EMAIL Y CONTRASEÑA
    const normalizedData = {
      email: data.email?.trim().toLowerCase(), // ← TRIM + LOWERCASE
      password: data.password?.trim() // ← TRIM
    };

    console.log('📤 Login normalizado:', normalizedData);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, normalizedData).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }

  // ===============================
  // 👤 PERFIL
  // ===============================

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(data: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/change-password`, data).pipe(
      tap(response => console.log('✅ Contraseña cambiad:', response)),
      catchError(this.handleError)
    );
  }

  resetPassword(data: ResetPasswordDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/reset-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(data: UpdateProfileDto): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, data).pipe(
      tap(user => {
        console.log('✅ Perfil actualizado:', user);
        this.currentUserSignal.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  // ===============================
  // 🔧 UTILIDADES
  // ===============================

  getToken(): string | null {
    const token = this.tokenSignal();
    console.log('📍 getToken() llamado. Token:', token ? '✅ EXISTE' : '❌ NO EXISTE');
    return token;
  }

  // ✅ NUEVO: Obtener email del usuario logueado
  getUserEmail(): string {
    const user = this.currentUserSignal();
    console.log('📍 getUserEmail() llamado. Email:', user?.email || '❌ NO EXISTE');
    return user?.email || '';
  }

  // ✅ NUEVO: Obtener nombre del usuario logueado
  getUserName(): string {
    const user = this.currentUserSignal();
    return user?.nombre || '';
  }

  // ✅ NUEVO: Obtener ID del usuario logueado
  getUserId(): number | null {
    const user = this.currentUserSignal();
    return user?.id || null;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { user, access_token } = response;

    console.log('✅ handleAuthSuccess - Guardando token y user');
    console.log('🔑 Token:', access_token);
    console.log('👤 User:', user);

    localStorage.setItem(this.TOKEN_KEY, access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.currentUserSignal.set(user);
    this.tokenSignal.set(access_token);

    console.log('✅ Signals actualizadas correctamente');
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    console.log('📍 loadFromStorage - Token:', token ? '✅ EXISTE' : '❌ NO EXISTE');
    console.log('📍 loadFromStorage - User:', userData ? '✅ EXISTE' : '❌ NO EXISTE');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSignal.set(user);
        this.tokenSignal.set(token);
        console.log('✅ Sesión restaurada correctamente');
      } catch (error) {
        console.error('❌ Error al restaurar sesión:', error);
        this.logout();
      }
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('❌ Error en AuthService:', error);

    let errorMessage = 'Error desconocido';

    if (error.error?.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(', ')
        : error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('❌ Mensaje de error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
