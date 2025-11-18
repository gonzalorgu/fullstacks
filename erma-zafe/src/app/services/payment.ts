import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environments';


export interface Payment {
  id?: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  rental_id: string;
  user_id: number;
  reference: string;
  status: string;
  receipt_image?: string;
  user?: { id: number; name: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
private apiUrl = `${environment.apiUrl}/payment`;


  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getAllWithUser(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/with-user`);
  }

  create(payment: any): Observable<any> {
    return this.http.post(this.apiUrl, payment);
  }

  update(id: string, payment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payment);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
