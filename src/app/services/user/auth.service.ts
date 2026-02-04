import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { AuthResponse, RegisterRequest, ResponseDto, UsuarioModel } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseLoginUrl = environment.apiUrl + 'api/v1/auth';
  private baseUrl = environment.apiUrl + 'api/users';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post<any>(this.baseLoginUrl + '/login', user);
  }

  addUsuario(usuario: UsuarioModel, file?: File): Observable<UsuarioModel> {

    const formData = new FormData();
    formData.append('user', JSON.stringify(usuario)); // Usuario como JSON
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<UsuarioModel>(
      `${this.baseUrl}`,
      formData
    );
  }

  register(request: RegisterRequest): Observable<ResponseDto<AuthResponse>> {
    return this.http.post<ResponseDto<AuthResponse>>(`${this.baseLoginUrl}/register`, request);
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}api/auth/forgot-password?email=${email}`, { email });
  }

}