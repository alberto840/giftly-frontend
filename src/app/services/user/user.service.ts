import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseLoginUrl = environment.apiUrl + 'api/auth/login';
  private baseUrl = environment.apiUrl + 'api/users';

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<UsuarioModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UsuarioModel[]>(`${this.baseUrl}`, { headers });
  }


  updateUsuario(usuario: UsuarioModel, file: File): Observable<UsuarioModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('user', JSON.stringify(usuario)); // Usuario como JSON
    formData.append('file', file);

    return this.http.put<UsuarioModel>(
      `${this.baseUrl}/${usuario.userId}`,
      formData,
      { headers }
    );
  }

  deleteUsuario(usuarioId: number): Observable<UsuarioModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<UsuarioModel>(`${this.baseUrl}/${usuarioId}`, { headers });
  }

  getUsuarioById(usuarioId: number): Observable<UsuarioModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UsuarioModel>(`${this.baseUrl}/${usuarioId}`, { headers });
  }

}
