import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments'; // Import corregido

export interface Maintenance {
  id: string;
  dressId: string;
  dressNombre: string;
  foto: string | null;
  tipo: 'lavado' | 'reparacion' | 'limpieza_profunda' | 'ajuste';
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
  observaciones: string | null;
  costo: number | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaintenanceDto {
  dressId: string;
  dressNombre: string;
  foto?: string;
  tipo: 'lavado' | 'reparacion' | 'limpieza_profunda' | 'ajuste';
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
  observaciones?: string;
  costo?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/maintenance`; // 👈 Usar environment

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createMaintenance(data: CreateMaintenanceDto): Observable<Maintenance> {
    return this.http.post<Maintenance>(
      `${this.apiUrl}/create`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getAllMaintenance(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(
      `${this.apiUrl}/all`,
      { headers: this.getHeaders() }
    );
  }

  getMaintenanceByDress(dressId: string): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(
      `${this.apiUrl}/dress/${dressId}`,
      { headers: this.getHeaders() }
    );
  }

  updateMaintenanceStatus(
    id: string,
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
  ): Observable<Maintenance> {
    return this.http.patch<Maintenance>(
      `${this.apiUrl}/${id}/status`,
      { estado },
      { headers: this.getHeaders() }
    );
  }

  deleteMaintenance(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
