import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { UsuarioModel } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseLoginUrl = environment.apiUrl + 'api/auth/login';
  private baseUrl = environment.apiUrl + 'api/users';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post<any>(this.baseLoginUrl, user);
  }


  addUsuario(usuario: UsuarioModel, file: File): Observable<UsuarioModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('user', JSON.stringify(usuario)); // Usuario como JSON
    formData.append('file', file);

    return this.http.post<UsuarioModel>(
      `${this.baseUrl}`,
      formData,
      { headers }
    );
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}api/auth/forgot-password?email=${email}`, { email });
  }

}