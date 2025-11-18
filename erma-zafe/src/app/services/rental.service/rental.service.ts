import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

export interface Rental {
  id?: string | number;
  dressId?: string;
  dressNombre?: string;
  foto?: string;
  desde?: string;
  hasta?: string;
  precioAlquiler?: number;
  talla?: string;
  color?: string;
  estado?: 'activo' | 'pasado' | 'cancelado' | 'pendiente' | 'retrasado';
  createdAt?: string;

  // ✅ NUEVOS CAMPOS PARA PENALIZACIÓN
  diasRetraso?: number;
  penalizacion?: number;
  fechaDevolucionReal?: string;

  // ✅ Campos adicionales del admin
  cliente?: string;
  clienteId?: number;
  clienteNombre?: string;
  clienteEmail?: string;
  vestido?: string;
  vestidoId?: number;
  precio?: number;
  fechaCreacion?: Date;
  notas?: string;

  // Backend fields
  user_id?: number;
  dress_id?: number;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  status?: string;
  created_at?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/rentals`;

  // 🔥 Obtener TODOS los alquileres (para admin)
  getAll(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.API_URL}/admin/all-rentals`);
    return this.http.get<Rental[]>(`${this.API_URL}/admin/all-rentals`).pipe(
      tap((data: Rental[]) => {
        console.log('✅ Datos recibidos:', data);
        data.forEach((rental: Rental) => {
          console.log(`📍 ID: ${rental.id} Cliente: ${(rental as any).clienteNombre || 'N/A'}`);
        });
      })
    );
  }

  // ✅ NUEVO: Obtener todos los alquileres con vista ADMIN (con penalizaciones)
  getAllAdmin(): Observable<Rental[]> {
    console.log('🔗 GET ADMIN:', `${this.API_URL}/admin/all-rentals`);
    return this.http.get<Rental[]>(`${this.API_URL}/admin/all-rentals`).pipe(
      tap((data: Rental[]) => {
        console.log('✅ Alquileres admin cargados:', data.length);
      }),
      catchError(err => {
        console.error('❌ Error al cargar alquileres admin:', err);
        throw err;
      })
    );
  }

  getMyRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/my-rentals`);
  }

  getActiveRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/active`);
  }

  getPastRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/past`);
  }

  getPendingRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/pending`);
  }

  getRentalById(id: string): Observable<Rental> {
    return this.http.get<Rental>(`${this.API_URL}/${id}`);
  }

  createRental(rental: Omit<Rental, 'id' | 'createdAt'>): Observable<Rental> {
    return this.http.post<Rental>(`${this.API_URL}`, rental);
  }

  createPaymentPending(data: any): Observable<Rental> {
    console.log('📤 createPaymentPending - INICIANDO...');
    console.log('📊 Datos enviados:', data);

    return this.http.post<Rental>(
      `${this.API_URL}/create-payment-pending`,
      data
    ).pipe(
      tap(
        (response: any) => {
          console.log('✅ createPaymentPending - ÉXITO!');
          console.log('✅ Respuesta del servidor:', {
            id: response.id,
            dressNombre: response.dressNombre,
            estado: response.estado,
            createdAt: response.createdAt,
          });
        }
      ),
      catchError(err => {
        console.error('❌ createPaymentPending - ERROR!');
        console.error('❌ Error:', err);
        throw err;
      })
    );
  }

  updateRental(id: string, rental: Partial<Rental>): Observable<Rental> {
    return this.http.put<Rental>(`${this.API_URL}/${id}`, rental);
  }

  // ✅ NUEVO: Actualizar alquiler (ADMIN) - con soporte para penalizaciones
  updateAdmin(id: string | number, data: Partial<Rental>): Observable<Rental> {
    console.log('📤 updateAdmin - ID:', id, 'Datos:', data);
    return this.http.patch<Rental>(`${this.API_URL}/${id}`, data).pipe(
      tap((response: Rental) => {
        console.log('✅ Alquiler actualizado:', response);
      }),
      catchError(err => {
        console.error('❌ Error al actualizar alquiler:', err);
        throw err;
      })
    );
  }

  cancelRental(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  // ✅ NUEVO: Eliminar alquiler (ADMIN)
  delete(id: string | number): Observable<void> {
    console.log('🗑️ Eliminando alquiler ID:', id);
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        console.log('✅ Alquiler eliminado');
      }),
      catchError(err => {
        console.error('❌ Error al eliminar:', err);
        throw err;
      })
    );
  }
}
