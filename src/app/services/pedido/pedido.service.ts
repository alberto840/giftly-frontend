import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pedido, PedidoRegistroRequest } from '../../models/pedido.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { ResponseDto } from '../../models/usuario.model';

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

  getPedidosCompletos(id?: number): Observable<any[]> {
    //if id exist add to the header
    let headers = this.authHeaders();
    if (id) {
      headers = headers.append('id', id.toString());
    }
    return this.http
      .get<ApiResponse<any[]>>(`${this.baseUrl}/pedidos-completos`, { headers: headers })
      .pipe(map(r => r.data));
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

  /**
 * Cambia el estado de una orden.
 * @param id El ID del pedido.
 * @param tipo El nuevo estado (ej. "ENTREGADO", "CANCELADO").
 */
  cambiarEstado(id: number, tipo: string): Observable<ResponseDto<Pedido>> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.put<ResponseDto<Pedido>>(`${this.baseUrl}/cambiar-estado/${id}`, {}, { 
      headers: this.authHeaders(),
      params: params
    });
  }
}