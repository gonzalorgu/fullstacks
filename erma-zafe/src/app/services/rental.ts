import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../src/environments/environments';

export interface Rental {
  id?: string | number;
  user_id?: number;
  user?: {
    id?: number;
    email?: string;
    name?: string;
  };
  clienteNombre?: string;
  clienteEmail?: string;
  dress_id?: number;
  start_date?: string;
  end_date?: string;
  total_cost?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  dressId?: string;
  dressNombre?: string;
  foto?: string;
  precioAlquiler?: number;
  cliente?: string;
  clienteId?: number;
  vestido?: string;
  vestidoId?: number;
  desde?: string;
  hasta?: string;
  estado?: string;
  precio?: number;
  fechaCreacion?: Date;
  notas?: string;
  talla?: string;
  color?: string;

  // ✅ NUEVOS CAMPOS PARA PENALIZACIÓN
  diasRetraso?: number;
  penalizacion?: number;
  fechaDevolucionReal?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rentals`;

  // ✅ OBTENER TODOS MIS ALQUILERES
  getAll(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/my-rentals`);
    return this.http.get<Rental[]>(`${this.apiUrl}/my-rentals`).pipe(
      tap(data => {
        console.log('✅ Datos recibidos:', data);
        data.forEach(d => console.log('📍 ID:', d.id, 'Cliente:', d.clienteNombre || d.clienteEmail));
      }),
      catchError(err => {
        console.error('❌ Error en GET:', err);
        return of([]);
      })
    );
  }

  // ✅ OBTENER UNO POR ID
  getOne(id: string | number): Observable<Rental> {
    console.log('🔗 GET:', `${this.apiUrl}/${id}`);
    return this.http.get<Rental>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('❌ Error:', err);
        throw err;
      })
    );
  }

  // ✅ CREAR ALQUILER (con estado por defecto activo)
  create(rental: Partial<Rental>): Observable<Rental> {
    console.log('🔗 POST:', this.apiUrl, 'Datos:', rental);
    return this.http.post<Rental>(this.apiUrl, rental).pipe(
      tap(data => console.log('✅ Creado:', data)),
      catchError(err => {
        console.error('❌ Error en POST:', err);
        throw err;
      })
    );
  }

  // ✅ ACTUALIZAR ALQUILER
  update(id: string | number, rental: Partial<Rental>): Observable<Rental> {
    console.log('🔗 PUT:', `${this.apiUrl}/${id}`, 'Datos:', rental);

    if (!id) {
      console.error('❌ ID inválido para update:', id);
      throw new Error('ID inválido');
    }

    return this.http.put<Rental>(`${this.apiUrl}/${id}`, rental).pipe(
      tap(data => console.log('✅ Actualizado:', data)),
      catchError(err => {
        console.error('❌ Error en PUT:', err);
        throw err;
      })
    );
  }

  // ✅ ELIMINAR ALQUILER
  delete(id: string | number): Observable<void> {
    console.log('🔗 DELETE:', `${this.apiUrl}/${id}`);

    if (!id) {
      console.error('❌ ID inválido para delete:', id);
      throw new Error('ID inválido');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('✅ Eliminado')),
      catchError(err => {
        console.error('❌ Error en DELETE:', err);
        throw err;
      })
    );
  }

  // ✅ CAMBIAR ESTADO DEL ALQUILER
  updateStatus(id: string | number, status: string): Observable<Rental> {
    console.log('🔗 PUT:', `${this.apiUrl}/${id}`, 'Status:', status);

    if (!id) {
      console.error('❌ ID inválido para updateStatus:', id);
      throw new Error('ID inválido');
    }

    return this.http.put<Rental>(`${this.apiUrl}/${id}`, { estado: status }).pipe(
      tap(data => console.log('✅ Estado actualizado:', data)),
      catchError(err => {
        console.error('❌ Error en updateStatus:', err);
        throw err;
      })
    );
  }

  // ✅ OBTENER ALQUILERES DEL USUARIO ACTUAL
  getByUser(userId: number): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/my-rentals`);
    return this.http.get<Rental[]>(`${this.apiUrl}/my-rentals`).pipe(
      catchError(err => {
        console.error('❌ Error:', err);
        return of([]);
      })
    );
  }

  // ✅ OBTENER ALQUILERES ACTIVOS
  getActive(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/active`);
    return this.http.get<Rental[]>(`${this.apiUrl}/active`).pipe(
      tap(data => console.log('✅ Activos encontrados:', data.length)),
      catchError(err => {
        console.error('❌ Error:', err);
        return of([]);
      })
    );
  }

  // ✅ OBTENER ALQUILERES PASADOS
  getPast(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/past`);
    return this.http.get<Rental[]>(`${this.apiUrl}/past`).pipe(
      tap(data => console.log('✅ Pasados encontrados:', data.length)),
      catchError(err => {
        console.error('❌ Error:', err);
        return of([]);
      })
    );
  }

  // ✅ OBTENER ALQUILERES PENDIENTES
  getPending(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/pending`);
    return this.http.get<Rental[]>(`${this.apiUrl}/pending`).pipe(
      tap(data => {
        console.log('✅ Pendientes encontrados:', data.length);
        data.forEach(d => console.log('📍 ID:', d.id, 'Estado:', d.estado));
      }),
      catchError(err => {
        console.error('❌ Error en getPending:', err);
        return of([]);
      })
    );
  }

  // ✅ CREAR ALQUILER PENDIENTE (para WhatsApp/Admin)
  createPaymentPending(rental: Partial<Rental>): Observable<Rental> {
    console.log('🔗 POST:', `${this.apiUrl}/create-payment-pending`, 'Datos:', rental);
    return this.http.post<Rental>(`${this.apiUrl}/create-payment-pending`, rental).pipe(
      tap(data => {
        console.log('✅ Alquiler Pendiente creado:', data);
        console.log('📊 Estado:', data.estado);
      }),
      catchError(err => {
        console.error('❌ Error en createPaymentPending:', err);
        throw err;
      })
    );
  }

  // ✅ OBTENER TODOS LOS ALQUILERES (ADMIN)
  getAllAdmin(): Observable<Rental[]> {
    console.log('🔗 GET:', `${this.apiUrl}/admin/all-rentals`);
    return this.http.get<Rental[]>(`${this.apiUrl}/admin/all-rentals`).pipe(
      tap(data => {
        console.log('✅ TODOS los alquileres (Admin):', data.length);
        data.forEach(d => console.log('📍 ID:', d.id, 'Usuario:', d.user?.email, 'Estado:', d.estado));
      }),
      catchError(err => {
        console.error('❌ Error:', err);
        return of([]);
      })
    );
  }

  // ✅ UPDATE ADMIN (Sin restricción de usuario) - CON SOPORTE PARA PENALIZACIONES
  updateAdmin(id: string | number, updates: Partial<Rental>): Observable<Rental> {
    console.log('🔗 PUT:', `${this.apiUrl}/admin/update/${id}`, 'Datos:', updates);

    if (!id) {
      console.error('❌ ID inválido para updateAdmin:', id);
      throw new Error('ID inválido');
    }

    return this.http.put<Rental>(`${this.apiUrl}/admin/update/${id}`, updates).pipe(
      tap(data => {
        console.log('✅ Actualizado (ADMIN):', data);
        if (updates.diasRetraso || updates.penalizacion) {
          console.log(`📊 Penalización: ${updates.diasRetraso} días = S/ ${updates.penalizacion}`);
        }
      }),
      catchError(err => {
        console.error('❌ Error en updateAdmin:', err);
        throw err;
      })
    );
  }
}
