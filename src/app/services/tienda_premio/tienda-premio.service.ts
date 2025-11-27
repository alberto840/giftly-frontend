import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TiendaPremio } from '../../models/tienda_premio.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class TiendaPremioService {
  private baseUrl = environment.apiUrl + 'api/v1/tiendaPremio';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<TiendaPremio[]> {
    return this.http
      .get<ApiResponse<TiendaPremio[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<TiendaPremio> {
    return this.http
      .get<ApiResponse<TiendaPremio>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: TiendaPremio): Observable<TiendaPremio> {
    return this.http
      .post<ApiResponse<TiendaPremio>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: TiendaPremio): Observable<TiendaPremio> {
    return this.http
      .put<ApiResponse<TiendaPremio>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}