import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PremioRecibido } from '../../models/premio_recibido.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class PremioRecibidoService {
  private baseUrl = environment.apiUrl + 'api/v1/premios-recibidos';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<PremioRecibido[]> {
    return this.http
      .get<ApiResponse<PremioRecibido[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getById(id: number): Observable<PremioRecibido> {
    return this.http
      .get<ApiResponse<PremioRecibido>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  getByUserId(userId: number): Observable<PremioRecibido[]> {
    return this.http
      .get<ApiResponse<PremioRecibido[]>>(`${this.baseUrl}/usuario/${userId}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: PremioRecibido): Observable<PremioRecibido> {
    return this.http
      .post<ApiResponse<PremioRecibido>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: PremioRecibido): Observable<PremioRecibido> {
    return this.http
      .put<ApiResponse<PremioRecibido>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}
