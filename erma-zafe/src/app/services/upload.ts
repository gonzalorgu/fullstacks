import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environments';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/image`, formData);
  }
}
