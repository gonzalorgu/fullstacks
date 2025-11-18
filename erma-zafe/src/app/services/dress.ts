import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environments';

export interface Dress {
  id?: number;
  name: string;
  size?: string;
  color?: string;
  status?: string;
  rental_price: number;
  catalog_id?: number;
  created_at?: Date;
  update_at?: Date;
  images?: string[]; // Agregado para las imágenes
}

@Injectable({
  providedIn: 'root'
})
export class DressService {
private apiUrl = `${environment.apiUrl}/dress`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Dress[]> {
    return this.http.get<Dress[]>(this.apiUrl);
  }

  // Alias para el componente de mantenimiento
  getAllDresses(): Observable<Dress[]> {
    return this.getAll();
  }

  getOne(id: number): Observable<Dress> {
    return this.http.get<Dress>(`${this.apiUrl}/${id}`);
  }

  create(dress: Dress): Observable<Dress> {
    return this.http.post<Dress>(this.apiUrl, dress);
  }

  update(id: number, dress: Partial<Dress>): Observable<Dress> {
    return this.http.patch<Dress>(`${this.apiUrl}/${id}`, dress);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
