import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environments';

export interface Reservation {
  id?: number;
  start_date: Date;
  end_date: Date;
  status?: string;
  customer_id: number;
  dress_id: number;
  created_at?: Date;
  update_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservation`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  create(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  update(id: number, reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
