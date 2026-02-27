import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = environment.apiUrl + 'api/notificaciones';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  enviarNotificacionTelegram(pedidoId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pedidoId', pedidoId.toString());
    return this.http.post(`${this.baseUrl}/enviar-comprobante`, formData, {
      responseType: 'text'
    });
  }
}