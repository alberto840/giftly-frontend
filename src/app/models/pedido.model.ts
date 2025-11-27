export interface Pedido {
    id: number;
    fechaCreacion: string; // java.sql.Date
    fechaEnvio: string;    // java.sql.Date
    total: number;         // BigDecimal
    qrId: number;
    usuarioId: number;
    tiendaPremioId: number;
}