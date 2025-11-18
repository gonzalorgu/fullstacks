import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environments';


export interface Customer {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: Date;
  update_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getOne(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  update(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
