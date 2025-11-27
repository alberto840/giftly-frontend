import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Rol } from '../../models/rol.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private baseUrl = environment.apiUrl + 'api/v1/rol';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<Rol[]> {
    return this.http
      .get<ApiResponse<Rol[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<Rol> {
    return this.http
      .get<ApiResponse<Rol>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: Rol): Observable<Rol> {
    return this.http
      .post<ApiResponse<Rol>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: Rol): Observable<Rol> {
    return this.http
      .put<ApiResponse<Rol>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}