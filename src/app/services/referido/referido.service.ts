import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Referido } from '../../models/referido.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class ReferidoService {
  private baseUrl = environment.apiUrl + 'api/v1/referido';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<Referido[]> {
    return this.http
      .get<ApiResponse<Referido[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<Referido> {
    return this.http
      .get<ApiResponse<Referido>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: Referido): Observable<Referido> {
    return this.http
      .post<ApiResponse<Referido>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: Referido): Observable<Referido> {
    return this.http
      .put<ApiResponse<Referido>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}