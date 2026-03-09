export interface PremioRecibido {
    id: number;
    recibido: boolean;
    fechaRecibido: Date;
    tipo: string;
    tiendaPremioId: number;
    userId: number;
}
