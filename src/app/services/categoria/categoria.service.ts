import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria } from '../../models/categoria.modelo';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private baseUrl = environment.apiUrl + 'api/v1/categoria';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<Categoria[]> {
    return this.http
      .get<ApiResponse<Categoria[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<Categoria> {
    return this.http
      .get<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: Categoria): Observable<Categoria> {
    return this.http
      .post<ApiResponse<Categoria>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: Categoria): Observable<Categoria> {
    return this.http
      .put<ApiResponse<Categoria>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}