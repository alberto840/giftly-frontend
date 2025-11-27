import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MisionUsuario } from '../../models/mision_usuario.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class MisionUsuarioService {
  private baseUrl = environment.apiUrl + 'api/v1/misionUsuario';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<MisionUsuario[]> {
    return this.http
      .get<ApiResponse<MisionUsuario[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<MisionUsuario> {
    return this.http
      .get<ApiResponse<MisionUsuario>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: MisionUsuario): Observable<MisionUsuario> {
    return this.http
      .post<ApiResponse<MisionUsuario>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: MisionUsuario): Observable<MisionUsuario> {
    return this.http
      .put<ApiResponse<MisionUsuario>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}