import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';
import { UsuarioModel } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiUrl + 'api/v1/usuario';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<UsuarioModel[]> {
    return this.http
      .get<ApiResponse<UsuarioModel[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<UsuarioModel> {
    return this.http
      .get<ApiResponse<UsuarioModel>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: UsuarioModel): Observable<UsuarioModel> {
    return this.http
      .post<ApiResponse<UsuarioModel>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: UsuarioModel): Observable<UsuarioModel> {
    return this.http
      .put<ApiResponse<UsuarioModel>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}