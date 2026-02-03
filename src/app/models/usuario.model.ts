export interface UsuarioModel {
  id?: number;
  nombreCompl: string;
  email: string;
  fechaNacimien: string; // java.sql.Date
  puntos?: number;
  rolId?: number;
}

export interface RegisterRequest {
  usuario: UsuarioModel;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioModel;
}

export interface ResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}