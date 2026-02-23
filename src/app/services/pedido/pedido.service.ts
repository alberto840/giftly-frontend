import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pedido, PedidoRegistroRequest } from '../../models/pedido.model';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private baseUrl = environment.apiUrl + 'api/v1/pedido';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<Pedido[]> {
    return this.http
      .get<ApiResponse<Pedido[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  registrarPedidoCompleto(request: PedidoRegistroRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar-completo`, request);
  }

  getById(id: number): Observable<Pedido> {
    return this.http
      .get<ApiResponse<Pedido>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  crear(body: Pedido): Observable<Pedido> {
    return this.http
      .post<ApiResponse<Pedido>>(`${this.baseUrl}/crear`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  actualizar(id: number, body: Pedido): Observable<Pedido> {
    return this.http
      .put<ApiResponse<Pedido>>(`${this.baseUrl}/actualizar/${id}`, body, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}