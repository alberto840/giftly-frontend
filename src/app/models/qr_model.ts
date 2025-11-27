export interface Qr {
  id: number;
  fechaCreacion: string;   // java.sql.Date
  fechaExpiracion: string; // java.sql.Date
  pedidoId: number;
}