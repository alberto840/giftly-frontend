import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Ubicacion } from '../../models/ubicacion.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private baseUrl = environment.apiUrl + 'api/v1/ubicacion';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<Ubicacion[]> {
    return this.http
      .get<ApiResponse<Ubicacion[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Ubicacion[]>> {
    return this.http.get<ApiResponse<Ubicacion[]>>(
      `${this.baseUrl}/usuario/${usuarioId}`, { headers: this.authHeaders() }
    );
  }

  getById(id: number): Observable<Ubicacion> {
    return this.http
      .get<ApiResponse<Ubicacion>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: Ubicacion): Observable<Ubicacion> {
    return this.http
      .post<ApiResponse<Ubicacion>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: Ubicacion): Observable<Ubicacion> {
    return this.http
      .put<ApiResponse<Ubicacion>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}