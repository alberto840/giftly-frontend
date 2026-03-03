import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Nivel, ResponseDto } from '../../models/niveles.model';

@Injectable({
  providedIn: 'root'
})
export class NivelService {
  private baseUrl = environment.apiUrl + 'api/v1/niveles';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  /**
   * Crea un nuevo nivel.
   * Método backend: POST /api/v1/niveles/crear
   */
  crearNivel(nivel: Nivel): Observable<Nivel> {
    return this.http.post<ResponseDto<Nivel>>(`${this.baseUrl}/crear`, nivel, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  /**
   * Obtiene la lista de todos los niveles.
   * Método backend: GET /api/v1/niveles
   */
  obtenerTodosLosNiveles(): Observable<Nivel[]> {
    return this.http.get<ResponseDto<Nivel[]>>(this.baseUrl, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  /**
   * Obtiene un nivel por su ID.
   * Método backend: GET /api/v1/niveles/{id}
   */
  obtenerNivelPorId(id: number): Observable<Nivel> {
    return this.http.get<ResponseDto<Nivel>>(`${this.baseUrl}/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  /**
   * Actualiza un nivel existente.
   * Método backend: PUT /api/v1/niveles/actualizar/{id}
   */
  actualizarNivel(id: number, nivel: Nivel): Observable<Nivel> {
    return this.http.put<ResponseDto<Nivel>>(`${this.baseUrl}/actualizar/${id}`, nivel, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }

  /**
   * Elimina un nivel por su ID.
   * Método backend: DELETE /api/v1/niveles/eliminar/{id}
   */
  eliminarNivel(id: number): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.baseUrl}/eliminar/${id}`, { headers: this.authHeaders() })
      .pipe(map(r => r.data));
  }
}
