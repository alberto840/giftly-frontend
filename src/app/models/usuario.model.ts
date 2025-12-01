export interface UsuarioModel {
  id: number;
  nombreCompl: string;
  email: string;
  fechaNacimien: string; // java.sql.Date
  puntos: number;
  rolId: number;
}